// https://leetcode.com/problems/minimum-window-substring/solutions/3325011/rust-floating-window-solution/
impl Solution {
    pub fn min_window(s: String, t: String) -> String {
        let mut res = "".to_string();
        let mut nums = t.bytes().fold(vec![0; 58], |mut mem, b| {
            mem[(b - b'A') as usize] += 1;
            mem
        });
        let sbytes = s.bytes().collect::<Vec<u8>>();
        let (mut l, mut r) = (0, 0);
        loop {
            while r < sbytes.len() && nums.iter().any(|&v| v > 0) {
                nums[(sbytes[r] - b'A') as usize] -= 1;
                r += 1;
            }
            if r == sbytes.len() && nums.iter().any(|&v| v > 0)  {
                return res
            }
            while l <= r && !nums.iter().any(|&v| v > 0) {
                nums[(sbytes[l] - b'A') as usize] += 1;
                l += 1;
            }
            if res.is_empty() {
                res = s.chars().take(r).skip(l-1).collect::<String>();
            } else {
                if 1 + r - l < res.len() {
                    res = s.chars().take(r).skip(l-1).collect::<String>();
                }
            }
        }
    }
}