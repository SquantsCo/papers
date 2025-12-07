import { Request, Response } from 'express';
import { logger } from '../utils/logger';
import { getCachedData, setCachedData } from '../utils/cache';
import Joi from 'joi';

export type ArxivMetadata = {
  id: string;
  title: string;
  summary: string;
  url: string;
  authors?: string[];
  published?: string;
  updated?: string;
  categories?: string[];
};

const lookupSchema = Joi.object({
  input: Joi.string().required().min(1).max(500),
});

/**
 * Extract an arXiv ID from a URL or raw ID input.
 */
export function extractArxivId(input: string): string | null {
  const trimmed = input.trim();
  // If it looks like a bare ID
  if (/^\d{4}\.\d{4,5}(v\d+)?$/.test(trimmed)) {
    return trimmed.replace(/v\d+$/, '');
  }
  // Try to pull from URL
  const match = trimmed.match(/arxiv\.org\/abs\/([0-9\.v]+)/i);
  if (match?.[1]) {
    return match[1].replace(/v\d+$/, '');
  }
  return null;
}

/**
 * Fetch basic metadata from arXiv's API.
 */
async function fetchArxivMetadata(id: string): Promise<ArxivMetadata | null> {
  const queryId = id.replace(/v\d+$/, '');
  const url = `${process.env.ARXIV_API_URL || 'https://export.arxiv.org/api/query'}?id_list=${encodeURIComponent(queryId)}`;

  const res = await fetch(url, {
    headers: {
      'User-Agent': process.env.USER_AGENT || 'SquantsPapers/1.0',
    },
  });

  if (!res.ok) {
    logger.error(`ArXiv API returned ${res.status} for ${queryId}`);
    return null;
  }

  const xml = await res.text();
  
  // Parse XML response
  const titleMatch = xml.match(/<title>([\s\S]*?)<\/title>/g);
  const summaryMatch = xml.match(/<summary>([\s\S]*?)<\/summary>/);
  const idMatch = xml.match(/<id>([\s\S]*?)<\/id>/g);
  const authorMatches = xml.match(/<author>[\s\S]*?<name>([\s\S]*?)<\/name>[\s\S]*?<\/author>/g);
  const publishedMatch = xml.match(/<published>([\s\S]*?)<\/published>/);
  const updatedMatch = xml.match(/<updated>([\s\S]*?)<\/updated>/);
  
  // Skip the first title (feed title) and get the entry title
  const entryTitle = titleMatch && titleMatch.length > 1 ? titleMatch[1] : titleMatch?.[0];
  
  if (!entryTitle || !summaryMatch || !idMatch || idMatch.length < 2) {
    logger.warn(`Failed to parse ArXiv response for ${queryId}`);
    return null;
  }

  const title = entryTitle.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
  const summary = summaryMatch[1].replace(/\s+/g, ' ').trim();
  const entryId = idMatch[1].replace(/<[^>]*>/g, '').trim();
  const link = entryId || `https://arxiv.org/abs/${queryId}`;

  // Parse authors
  const authors = authorMatches?.map(author => {
    const nameMatch = author.match(/<name>([\s\S]*?)<\/name>/);
    return nameMatch ? nameMatch[1].trim() : '';
  }).filter(Boolean);

  // Parse dates
  const published = publishedMatch ? publishedMatch[1].trim() : undefined;
  const updated = updatedMatch ? updatedMatch[1].trim() : undefined;

  return {
    id: queryId,
    title,
    summary,
    url: link,
    authors,
    published,
    updated,
  };
}

export const lookupArxiv = async (req: Request, res: Response) => {
  try {
    const { error, value } = lookupSchema.validate(req.body);
    
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { input } = value;
    const arxivId = extractArxivId(input);

    if (!arxivId) {
      return res.status(400).json({ 
        error: 'Could not parse arXiv ID from input. Please provide a valid arXiv ID or URL.' 
      });
    }

    // Check cache first
    const cacheKey = `arxiv:${arxivId}`;
    const cached = getCachedData<ArxivMetadata>(cacheKey);
    
    if (cached) {
      logger.info(`Cache hit for arXiv ID: ${arxivId}`);
      return res.json(cached);
    }

    // Fetch from arXiv API
    const metadata = await fetchArxivMetadata(arxivId);

    if (!metadata) {
      return res.status(502).json({ 
        error: 'Could not fetch metadata from arXiv. Please verify the ID and try again.' 
      });
    }

    // Cache the result
    setCachedData(cacheKey, metadata);
    logger.info(`Fetched and cached arXiv metadata: ${arxivId}`);

    res.json(metadata);
  } catch (err) {
    logger.error('Error in lookupArxiv:', err);
    res.status(500).json({ error: 'Unexpected error while looking up arXiv metadata.' });
  }
};
