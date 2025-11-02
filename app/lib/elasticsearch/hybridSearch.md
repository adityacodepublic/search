What is RRF

RRF stands for **Reciprocal Rank Fusion**, a ranking algorithm used to combine results from multiple retrieval systems (like semantic and lexical search) by fusing their rankings. It calculates a score for each document based on its position in each result set, giving higher weight to documents that rank highly across multiple queries without needing manual tuning of weights or boosts.

### Why RRF over Bool Query?
- **Simplicity**: RRF doesn't require you to manually balance weights (e.g., via `boost` in a `bool` query's `should` clauses). It automatically merges rankings based on reciprocal ranks, making it easier to implement hybrid search.
- **Effectiveness**: RRF often performs better for hybrid scenarios because it handles the fusion of semantic (meaning-based) and lexical (keyword-based) results more robustly, especially when the two methods return different top results.
- **No Parameter Tuning**: In a `bool` query with `should`, you might need to experiment with boosts (e.g., `{ "match": { "field": { "query": "term", "boost": 2 } } }`) to balance semantic vs. lexical relevance, which can be subjective and error-prone. RRF avoids this by using a formula like `score = sum(1 / (k + rank))` for each retriever.
- **Use Case Fit**: For hybrid search combining semantic_text and traditional text fields, RRF is the recommended approach in Elastic's documentation, as it provides a balanced, out-of-the-box fusion.

If you prefer a `bool` query, you could replace the RRF retriever with something like:
```json
{
  "query": {
    "bool": {
      "should": [
        { "multi_match": { "query": "your query", "fields": ["name", "address", ...], "boost": 1 } },
        { "semantic": { "field": "semantic_text", "query": "your query", "boost": 1 } }
      ]
    }
  }
}
```
But you'd need to tune the `boost` values for optimal results, whereas RRF handles this automatically. Let me know if you'd like to switch to a `bool` query instead!