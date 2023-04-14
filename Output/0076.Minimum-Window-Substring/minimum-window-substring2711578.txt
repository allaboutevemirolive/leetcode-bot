// https://leetcode.com/problems/minimum-window-substring/solutions/2711578/two-pointers-rust-solution/
const SIZE: usize = (b'z' - b'A' + 1) as usize;

impl Solution {
    pub fn min_window(s: String, t: String) -> String {
        if s.len() < t.len() { return "".to_string(); }

        let (mut blueprint, mut compatibility) = ([0; SIZE], [0; SIZE]);

        let mut unique_chars = 0;
        for c in t.bytes() {
            let i = (c - b'A') as usize;
            if blueprint[i] == 0 {
                unique_chars += 1;
            }
            blueprint[i] += 1;
        }

        let (mut opt_left, mut opt_right) = (0, usize::MAX);

        let main_string = s.as_bytes();
        let mut chars_found = 0;
        
        let mut left = 0;
        for right in 0..main_string.len() {
            let r_position = (main_string[right] - b'A') as usize;

            if blueprint[r_position] > 0 {
                compatibility[r_position] += 1;
                if compatibility[r_position] == blueprint[r_position] {
                    chars_found += 1;
                }

                if chars_found == unique_chars {
                    let mut l_position = (main_string[left] - b'A') as usize;
                    while blueprint[l_position] == 0
                        || compatibility[l_position] > blueprint[l_position]
                    {
                        if compatibility[l_position] > 0 {
                            compatibility[l_position] -= 1;
                        }

                        left += 1;
                        l_position = (main_string[left] - b'A') as usize;
                    }

                    if right - left < opt_right - opt_left {
                        opt_left = left;
                        opt_right = right;
                    }
                }
            }
        }

        if opt_right == usize::MAX { return "".to_string(); }

        s[opt_left..opt_right + 1].to_string()
    }
}