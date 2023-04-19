// https://leetcode.com/problems/word-break-ii/solutions/1120649/naive-rust-recursion-but-works/
impl Solution {
    pub fn word_break(s: String, word_dict: Vec<String>) -> Vec<String> {
        fn search(ss: &[u8], dict: &[String]) -> Vec<String> {
            if ss.is_empty() {
                return vec!["".into()];
            }
            let mut ans = vec![];
            for word in dict {
                let len = word.len();
                if len > ss.len() {
                    continue;
                }
                if &ss[0..len] == word.as_bytes() {
                    search(&ss[len..], dict)
                        .into_iter()
                        .map(|x| format!("{}{}{}", 
                            word, (if x == "" {""} else {" "}), x))
                        .for_each(|s| ans.push(s));
                }
            }
            ans
        }
        let ss = s.as_bytes();
        search(ss, &word_dict)
    }
}