// https://leetcode.com/problems/decode-ways-ii/solutions/1733752/rust-dp-time-o-n-space-o-1-clean-code/
impl Solution {
    pub fn num_decodings(s: String) -> i32 {
        let mut prev_prev = 0;
        let mut prev = 1;
        let bytes = s.as_bytes();

        for (i, &b) in bytes.iter().enumerate() {
            let single = Solution::count_one_letter_decodings(b);
            let with_prev = if i == 0 {
                0
            } else {
                Solution::count_two_letter_decodings(&bytes[i - 1..i + 1])
            };

            if single == 0 && with_prev == 0 {
                return 0;
            }

            let curr = prev * single as i64 + prev_prev * with_prev as i64;
            prev_prev = prev;
            prev = curr % M;
        }

        prev as i32
    }

    fn count_one_letter_decodings(letter: u8) -> i32 {
        match letter {
            b'0' => 0,
            b'*' => 9,
            _ => 1,
        }
    }

    fn count_two_letter_decodings(two_letters: &[u8]) -> i32 {
        if two_letters == "**".as_bytes() {
            return 15;
        }

        if two_letters[0] == b'*' {
            return match two_letters[1] {
                b'0'..=b'6' => 2,
                _ => 1,
            };
        }

        if two_letters[1] == b'*' {
            return match two_letters[0] {
                b'1' => 9,
                b'2' => 6,
                _ => 0,
            };
        }

        let v = (two_letters[0] - b'0') as i32 * 10 + (two_letters[1] - b'0') as i32;
        match v {
            10..=26 => 1,
            _ => 0,
        }
    }
}

const M: i64 = 1_000_000_007;