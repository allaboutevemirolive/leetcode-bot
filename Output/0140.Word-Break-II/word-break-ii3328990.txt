// https://leetcode.com/problems/word-break-ii/solutions/3328990/rust-recursive-solution/
impl Solution {
    pub fn word_break(s: String, mut word_dict: Vec<String>) -> Vec<String> {
        word_dict.retain(|w| s.contains(w));
        let mut res =vec![];
        Self::create_sentence(&word_dict, &mut vec![], &s, &mut res);
        res
    }
    pub fn create_sentence(dict: &Vec<String>, words: &mut Vec<String>, word: &str, res: &mut Vec<String>) {
        if word.is_empty() {
            res.push(words.join(" "));
            return;
        }
        dict.iter().for_each(|w| {
            if word.starts_with(w) {
                let mut new = words.clone();
                new.push(w.clone());
                Self::create_sentence(dict, &mut new, word.strip_prefix(w).unwrap(), res)
            }
        })
    }
}