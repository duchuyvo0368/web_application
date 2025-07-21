// src/utils/extract-metadata.ts
import got from 'got';
import metascraper from 'metascraper';
import metascraperTitle from 'metascraper-title';
import metascraperDescription from 'metascraper-description';
import metascraperImage from 'metascraper-image';
import metascraperUrl from 'metascraper-url';

const scraper = metascraper([
    metascraperTitle(),
    metascraperDescription(),
    metascraperImage(),
    metascraperUrl(),
]);

export async function extractMetadata(url: string) {
    try {
        const { body: html, url: finalUrl } = await got(url);
        const metadata = await scraper({ html, url: finalUrl });

        return {
            url: metadata.url,
            title: metadata.title,
            description: metadata.description,
            image: metadata.image,
        };
    } catch (error) {
        console.error('Metadata extraction failed:', error.message);
        return null;
    }
}
