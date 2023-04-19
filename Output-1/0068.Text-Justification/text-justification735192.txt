// https://leetcode.com/problems/text-justification/solutions/735192/rust-clean-0ms-solution/
impl Solution {
    pub fn full_justify(words: Vec<String>, max_width: i32) -> Vec<String> {
        let max_width = max_width as usize;

        let mut begin_i = 0;
        let mut line_len = 0;
        let mut words_len = 0;

        let mut result = vec![];

        for (i, word) in words.iter().enumerate() {
            if line_len + word.len() > max_width {
                let mut line = String::new();

                let num_gaps = i - begin_i - 1;
                let num_empties = max_width - words_len;
                line.push_str(&words[begin_i]);
                if num_gaps == 0 {
                    line.push_str(&" ".repeat(num_empties));
                } else {
                    let empty_base = num_empties / num_gaps;
                    let empty_offset = num_empties % num_gaps;

                    for i in 1..=num_gaps {
                        line.push_str(&" ".repeat(empty_base + if i <= empty_offset { 1 } else { 0 }));
                        line.push_str(&words[begin_i + i]);
                    }
                }
                result.push(line);

                begin_i = i;
                line_len = 0;
                words_len = 0;
            }
            line_len += word.len() + 1;
            words_len += word.len();
        }
        if words_len > 0 {
            let mut line = String::new();
            line.push_str(&words[begin_i]);
            for i in begin_i + 1..words.len() {
                line.push(' ');
                line.push_str(&words[i]);
            }
            line.push_str(&" ".repeat(max_width - line.len()));
            result.push(line);
        }
        result
    }
}