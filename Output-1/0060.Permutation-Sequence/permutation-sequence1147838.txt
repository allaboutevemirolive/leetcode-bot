// https://leetcode.com/problems/permutation-sequence/solutions/1147838/rust-0ms-2-0-mb/
const MAX_N: usize = 9;

const fn factorial_generator() -> [usize; MAX_N + 1] {
    let mut arr = [0_usize; MAX_N + 1];
    arr[0] = 1;
    let mut i = 1;
    while i <= MAX_N {
        arr[i] = i * arr[i - 1];
        i += 1;
    }
    arr
}

const FACTORIALS: [usize; MAX_N + 1] = factorial_generator();

impl Solution {
    pub fn get_permutation(n: i32, k: i32) -> String {
        let n = n as usize;

        let mut str = String::with_capacity(n);

        let mut k_left = k as usize - 1; // 0-indexed

        let mut available_numbers: Vec<_> = (1..=n as u8).collect();

        for factorial_idx in (0..n).rev() {
            let factorial = FACTORIALS[factorial_idx];

            let num_to_push_idx = k_left / factorial;
            let num_to_push = available_numbers.remove(num_to_push_idx);

            let char_to_push = (num_to_push + b'0') as char;
            str.push(char_to_push);
            k_left %= factorial;
        }

        str
    }
}