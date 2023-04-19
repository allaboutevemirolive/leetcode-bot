// https://leetcode.com/problems/text-justification/solutions/3361982/rust-solution/
impl Solution {
    fn last_line(words: &[String], max_width: i32) -> String {
        let mut res = "".to_owned();
        for (i, w) in words.iter().enumerate() {
            res.push_str(w);
            if i < words.len() - 1 {
                res.push(' ');
            }
        }
        for _ in 0..(max_width - res.len() as i32) {
            res.push(' ');
        }
        res
    }

    fn line_output(words: &[String], words_len: i32, max_width: i32) -> String {
        let mut res = "".to_owned();
        let space_slot_count = (words.len() as i32 - 1).max(1);
        let space_count = max_width - words_len;
        let mut slot_count = space_slot_count;
        let space_per_slot = space_count / space_slot_count;
        let mut rem_space = space_count - space_per_slot * space_slot_count;
        for w in words {
            res.push_str(w);
            if slot_count > 0 {
                for _ in 0..space_per_slot {
                    res.push(' ');
                }
                slot_count -= 1;
            }
            if rem_space > 0 {
                res.push(' ');
                rem_space -= 1;
            }
        }
        res
    }

    pub fn full_justify(words: Vec<String>, max_width: i32) -> Vec<String> {
        let mut res = vec![];
        let len_vec: Vec<i32> = words.iter().map(|i| i.len() as i32).collect();
        let mut i = 0;
        while i < words.len() {
            let mut j = i;
            let mut word_count = 0;
            let mut word_len = 0;
            let mut line_width = 0;
            while j < words.len() {
                let insert_len = if word_count == 0 {
                    line_width + len_vec[j]
                } else {
                    line_width + len_vec[j] + 1
                };
                if insert_len <= max_width {
                    line_width += len_vec[j];
                    word_len += len_vec[j];
                    word_count += 1;
                    if word_count > 1 {
                        line_width += 1;
                    }
                } else {
                    break;
                }
                j += 1;
            }
            let s = if j < words.len() {
                Solution::line_output(&words[i..j], word_len, max_width)
            } else {
                Solution::last_line(&words[i..j], max_width)
            };
            res.push(s);
            i = j;
        }
        res
    }
}