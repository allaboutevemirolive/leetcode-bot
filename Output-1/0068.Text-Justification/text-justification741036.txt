// https://leetcode.com/problems/text-justification/solutions/741036/rust-solution/
impl Solution {
    pub fn full_justify(words: Vec<String>, max_width: i32) -> Vec<String> {
        let mut cline: Vec<String> = Vec::new();
        let mut clen: usize = 0;
        let max_width: usize = max_width as usize;
        let mut result: Vec<String> = Vec::new();
        
        for word in words.iter() {
            if clen + word.len() + cline.len() <= max_width {
                cline.push(word.to_string());
                clen += word.len();
                continue
            }
            
            if cline.len() == 1 {
                let temp = format!("{0:1$}", cline[0], max_width);
                result.push(temp);
            } else {
                let temp = cline.len() - 1;
                for i in 0..(max_width - clen) {
                    cline[i % temp].push(' ');
                }
                
                let temp = cline.join("");
                result.push(temp);
            }
            
            cline = vec![word.to_string()];
            clen = word.len();
        }
        
        let temp = format!("{0:1$}", cline.join(" "), max_width);
        result.push(temp);
        result
    }
}