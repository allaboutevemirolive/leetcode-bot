// https://leetcode.com/problems/shortest-palindrome/solutions/365580/rust-kmp-based-solution/
    pub fn shortest_palindrome(s: String) -> String {
        fn get_prefix_table(s: &[u8]) -> Vec<usize> {
            // the values in table is 1-based index, in order to use `size_t`
            // so `1` correspond to `s[0]`.
            // Or, `l` correspond to `s[l-1]`, vice versa `s[l]` correspond to `l+1`
            let mut table = vec![0; s.len()];
            let mut left = 0;
            for i in 1..s.len() {
                while left > 0 && s[left] != s[i] {
                    left = table[left - 1];
                }

                if s[left] == s[i] {
                    left += 1;
                }
                table[i] = left;
            }
            table
        }

        let table = get_prefix_table(&s.as_bytes());
        let mut left = 0;
        let s_vec = s.as_bytes();
        for i in (0..s_vec.len()).rev() {
            while left > 0 && s_vec[left] != s_vec[i] {
                left = table[left - 1];
            }

            if s_vec[left] == s_vec[i] {
                left += 1;
            }
        }
        s[left..].chars().rev().collect::<String>() + &s
    }
}