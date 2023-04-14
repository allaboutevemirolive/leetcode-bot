// https://leetcode.com/problems/word-break-ii/solutions/984730/rust-dfs/
impl Solution {
    pub fn word_break(s: String, word_dict: Vec<String>) -> Vec<String> {
        let mut result:Vec<String> = Vec::new();
        if Self::can_word_break(&s, &word_dict) == false {
            return result;
        }

        let mut sentence:Vec<String> = Vec::new();
        Self::dfs(&s, &word_dict, &mut sentence, &mut result);

        result
    }

    fn dfs(s: &str, word_dict: &[String], sentence: &mut Vec<String>, result: &mut Vec<String>) {
        let len = s.len();
        if len == 0 {
            result.push(sentence.join(" "));
        }
        for i in 1..=len {
            let target = &s[0..i];
            let rest = &s[i..];
            if word_dict.iter().any(|w| w == target) {
                sentence.push(target.to_string());
                Self::dfs(rest, word_dict, sentence, result);
                sentence.pop();
            }
        }
    }

    fn can_word_break(s: &String, word_dict: &Vec<String>) -> bool {
        let len = s.len();
        let mut dp:Vec<bool> = vec![false; len + 1];
        dp[0] = true;

        for i in 1..=len {
            let idx = i - 1;
            for word in word_dict.iter() {
                let l = word.len();
                let last_ch = word.chars().last().unwrap();
                if s.chars().nth(idx).unwrap() == last_ch && idx + 1 >= l {
                    let start = idx + 1 - l;
                    let end = idx + 1;
                    if &s[start..end] == &word[..] {
                        dp[i] |= dp[i - l];
                    } 
                }
            }
        }
        dp[len]
    }
}