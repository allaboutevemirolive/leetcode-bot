// https://leetcode.com/problems/concatenated-words/solutions/1662153/rust-tle/
use std::hash::Hasher;

impl Solution {
    pub fn find_all_concatenated_words_in_a_dict(words: Vec<String>) -> Vec<String> {
        let mut hash_set = std::collections::HashSet::new();
        for word in &words {
            let mut hasher = std::collections::hash_map::DefaultHasher::new();
            for byte in word.bytes() {
                hasher.write_u8(byte);
            }
            hash_set.insert(hasher.finish());
        }
        let mut res = Vec::new();
        for word in words {
            let s = word.bytes().collect::<Vec<u8>>();
            let n = s.len();
            if Self::dfs(0, 0, &hash_set, &s, n) {
                res.push(word);
            }
        }
        res
    }

    fn dfs(
        start: usize,
        k: usize,
        hash_set: &std::collections::HashSet<u64>,
        s: &[u8],
        n: usize,
    ) -> bool {
        if start == n {
            k >= 2
        } else {
            let mut hasher = std::collections::hash_map::DefaultHasher::new();
            for i in start..n {
                hasher.write_u8(s[i]);
                if hash_set.contains(&hasher.finish()) && Self::dfs(i + 1, k + 1, hash_set, s, n) {
                    return true;
                }
            }
            false
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_0472_example_1() {
        let words = vec_string![
            "cat",
            "cats",
            "catsdogcats",
            "dog",
            "dogcatsdog",
            "hippopotamuses",
            "rat",
            "ratcatdogcat"
        ];

        let result = vec_string!["catsdogcats", "dogcatsdog", "ratcatdogcat"];

        assert_eq!(
            Solution::find_all_concatenated_words_in_a_dict(words),
            result
        );
    }

    #[test]
    fn test_0472_example_2() {
        let words = vec_string!["cat", "dog", "catdog"];

        let result = vec_string!["catdog"];

        assert_eq!(
            Solution::find_all_concatenated_words_in_a_dict(words),
            result
        );
    }
}