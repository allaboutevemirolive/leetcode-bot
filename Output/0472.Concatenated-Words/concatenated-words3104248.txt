// https://leetcode.com/problems/concatenated-words/solutions/3104248/dp-solution-in-rust-with-comments/
impl Solution {
    pub fn find_all_concatenated_words_in_a_dict(mut words: Vec<String>) -> Vec<String> {
        // Sort words by length, so shorter words come first
        words.sort_unstable_by(|a, b| a.len().cmp(&b.len()));

        // Declare empty answer vector and word dictionary
        let mut ans = vec![];
        let mut word_set = std::collections::HashSet::new();
        // Allocate common dp array for all words
        let mut dp = vec![false; 31];
        dp[0] = true; // Consider empty prefix as valid word concatenation
        for word in words.iter().map(|w| w.as_bytes()) {
            let n = word.len();
            for i in 1..=n {
                for j in 0..i {
                    // The substring word[0..i] is a valid word concatenation
                    // if for a some split point j its prefix dp[j] is a valid concatenation
                    // and suffix word[j..i] is equal to one of previous words in our list.
                    dp[i] = dp[j] && word_set.contains(&word[j..i]);
                    if dp[i] {
                        break;
                    }
                }
            }
            if dp[n] {
                // if word is a concatenated word then add it to the ans
                ans.push(String::from_utf8(word.to_vec()).unwrap());
            }
            else {
                // Otherwise, the word is not a composition of previous words
                // so we must add it to dictionary, as it may be a part of some future word
                word_set.insert(word);
            }
        }

        ans
    }
}