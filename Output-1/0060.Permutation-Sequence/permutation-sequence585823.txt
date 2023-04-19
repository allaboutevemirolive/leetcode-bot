// https://leetcode.com/problems/permutation-sequence/solutions/585823/rust-solution-no-dfs-only-math-calculation-0ms-2-1mb-both-100/
impl Solution {
    pub fn get_permutation(n: i32, mut k: i32) -> String {
        // FACTORIAL of numbers from 0! to 9!
        const FACTORIAL: [i32; 10] = [1, 1, 2, 6, 24, 120, 720, 5040, 40320, 362880];
        let mut numbers = vec!['1', '2', '3', '4', '5', '6', '7', '8', '9'];
        let mut sequence = String::new();
        // necessary
        k = k - 1;

        for i in 0..n {
            let idx = (n - 1 - i) as usize;
            let div = k / FACTORIAL[idx];

            k = k % FACTORIAL[idx];
            sequence.push(numbers.remove(div as usize));
        }

        sequence
    }
}