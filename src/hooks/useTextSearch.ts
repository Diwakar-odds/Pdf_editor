import { useState, useCallback } from 'react';
import { usePDFStore } from '../store/usePDFStore';
import { pdfjs } from 'react-pdf';

export interface SearchResult {
    pageNumber: number;
    text: string;
    index: number;
}

export function useTextSearch() {
    const { file } = usePDFStore();
    const [results, setResults] = useState<SearchResult[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isSearching, setIsSearching] = useState(false);

    const search = useCallback(async (query: string) => {
        if (!file || !query.trim()) {
            setResults([]);
            setCurrentIndex(0);
            return;
        }

        setIsSearching(true);
        const searchResults: SearchResult[] = [];

        try {
            const arrayBuffer = await file.arrayBuffer();
            const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
            const numPages = pdf.numPages;

            for (let pageNum = 1; pageNum <= numPages; pageNum++) {
                const page = await pdf.getPage(pageNum);
                const textContent = await page.getTextContent();
                const pageText = textContent.items
                    .map((item: any) => item.str)
                    .join(' ');

                const lowerQuery = query.toLowerCase();
                const lowerText = pageText.toLowerCase();
                let index = 0;

                while ((index = lowerText.indexOf(lowerQuery, index)) !== -1) {
                    searchResults.push({
                        pageNumber: pageNum,
                        text: pageText.substring(Math.max(0, index - 20), index + query.length + 20),
                        index: searchResults.length
                    });
                    index += query.length;
                }
            }

            setResults(searchResults);
            setCurrentIndex(searchResults.length > 0 ? 0 : -1);
        } catch (error) {
            console.error('Search failed:', error);
            setResults([]);
        } finally {
            setIsSearching(false);
        }
    }, [file]);

    const next = useCallback(() => {
        if (results.length > 0) {
            setCurrentIndex((prev) => (prev + 1) % results.length);
        }
    }, [results.length]);

    const prev = useCallback(() => {
        if (results.length > 0) {
            setCurrentIndex((prev) => (prev - 1 + results.length) % results.length);
        }
    }, [results.length]);

    const clear = useCallback(() => {
        setResults([]);
        setCurrentIndex(0);
    }, []);

    return {
        search,
        results,
        currentIndex,
        currentResult: results[currentIndex],
        next,
        prev,
        clear,
        isSearching,
        hasResults: results.length > 0
    };
}
