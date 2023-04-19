// https://leetcode.com/problems/minimum-window-substring/solutions/1422365/rust-slide-window-hash-map/
use std::collections::HashMap;
impl Solution {
    pub fn min_window(s: String, t: String) -> String {
        let origin_str_bytes = s.as_bytes();
        let target_str_bytes = t.as_bytes();

        let mut target_str_map =
            t.as_bytes()
                .iter()
                .fold(HashMap::new(), |mut a: HashMap<u8, i32>, &b| {
                    a.entry(b).and_modify(|t| *t += 1).or_insert(1);
                    a
                });

        let need_count = target_str_bytes.len();
        let mut count: usize = 0;
        let mut l: usize = 0;
        let mut min_l: usize = 0;

        let mut size: usize = origin_str_bytes.len() + 1;

        for (r, c) in origin_str_bytes.iter().enumerate() {
            // 1. make window contain all char in target string
            target_str_map.entry(*c).and_modify(|t| {
                *t -= 1; // reduce this all the time could limit max touched times while move `l`
                if *t >= 0 {
                    count += 1;
                }
            });

            // 2. *try* move left point to right to get minimum window size
            while count == need_count {
                // only apply changes when the situation meets the requirements of the problem
                // if l > min_l { // If you use l as a condition, you will miss the update when s is equal to t
                if r - l + 1 < size {
                    min_l = l;
                    size = r - l + 1;
                }

                target_str_map.entry(origin_str_bytes[l]).and_modify(|t| {
                    *t += 1;
                    if *t > 0 {
                        count -= 1;
                    }
                });
                l += 1; // must after minus target char touch count logic
            }
        }
		if size > origin_str_bytes.len() {
			return String::new();
		}
        String::from_utf8(origin_str_bytes[min_l..min_l + size].to_vec()).unwrap()
    }
}