// https://leetcode.com/problems/word-break-ii/solutions/2563038/rust-0ms-backtrack/
impl Solution {
    pub fn word_break(s: String, word_dict: Vec<String>) -> Vec<String> {
        fn walk(result: &mut Vec<String>, buffer: &mut Vec<String>, s: &str, word_dict: &Vec<String>) {
            if s.len()==0 {
                result.push(buffer.join(" "));
            }

            for word in word_dict.iter() {
                let len = word.len();
                if s.len()>=len && word==&s[0..len] {
                    buffer.push(s[0..len].to_string());
                    walk(result, buffer, &s[len..], word_dict);
                    buffer.pop();
                }
            }
        }


        let mut buf = Vec::new();
        let mut res = Vec::new();

        walk(&mut res, &mut buf, &s, &word_dict);
        res
    }
}