// https://leetcode.com/problems/word-break-ii/solutions/1542990/rust-backtrack-0ms/
use std::collections::HashSet;
use std::iter::FromIterator;


impl Solution {
    pub fn word_break(s: String, word_dict: Vec<String>) -> Vec<String> {
        let word_dict: HashSet<String> = HashSet::from_iter(word_dict.clone().into_iter());

        fn split(
            str_: String,
            wd: &HashSet<String>,
            start: usize,
            mut end: usize,
            mut path: &mut Vec<String>,
            mut res: Vec<String>,
        ) -> Vec<String> {
            if end > str_.len() {
                res.push(path.clone().join(" "));
                return res;
            }
            while end <= str_.len() {
                let substr = &str_[start..end];
                if wd.contains(substr) {
                    path.push(substr.to_string());
                    res = split(str_.clone(), wd, end, end + 1, &mut path, res);
                    path.pop();
                }
                end += 1;
            }

            res
        }

        split(s, &word_dict, 0, 0, &mut vec![], vec![])
    }
}