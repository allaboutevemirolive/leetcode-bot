// https://leetcode.com/problems/palindrome-partitioning-ii/solutions/1388635/rust-iterative-dynamic-programming-o-n-2-time-o-n-space/
use std::cmp::min;
use std::convert::TryFrom;
impl Solution {
    /***
     * What is the minimum number of cuts in s needed
     * such that the substrings in between each cut are palindromes?
     *
     * Observation: one such partitioning is that we insert cuts
     * in between each letter. 
     *
     * Formula: min_cut(s, i) = min(1 + min_cut(s, j + 1) for all j where s[i:j] is a palindrome)
     * note that j = i + 1 is always an option assuming we have more than one character.
     *
     * Notice we can solve iteratively in O(N^2) time, O(N) space.
     ***/
    pub fn min_cut(s: String) -> i32 {
        if s.is_empty() {
            return 0;
        }
        
        let S: Vec<char> = s.chars().collect();
        let N: usize = S.len();
        let mut dp: Vec<i32> = vec![i32::try_from(N + 1).ok().unwrap(); N + 1]; // dp[i] = min_cut(s, i)
        dp[N] = -1; // case where examined string is a palindrome; we always add 1, so in this case it results in 0 cuts.
        let mut pal_check: Vec<bool> = vec![false; N];
        for left in (0..N).rev() {
            // calculate all palindromes whose left index is at left
            Solution::validate_palindromes(&S, N, &mut pal_check, left);

            // println!("---------------");
            // compute the minimum palindrome for dp[left].
            for right in left..N { // Calculate min_cut(S, left) = min(1 + min_cut(S, right + 1)) for all S[left:right] that are palindromes
                if pal_check[right] {
                    dp[left] = min(dp[left], 1 + dp[right + 1]);
                }
            }
        }
        
        return dp[0];
    }
    
    /***
     * Assuming we're calculating palindromes starting at index left
     * and that pal_check[left+1:end] corresponds to palindrome checks for
     * S[left+1:end], compute pal_check[left:end] for S[left:end]
     ***/
    fn validate_palindromes(
        S: &Vec<char>,
        N: usize,
        pal_check: &mut Vec<bool>,
        left: usize
    ) -> () {
        for right in ((left + 2)..N).rev() { // length 3 and up palindromes
            // is S[left:right] is a palindrome iff
            // S[left] == S[right] and S[left+1:right-1] is a palindrome.
            // note that in our dynamic programming scheme, S[left+1:right-1]
            // corresponds to pal_check[right - 1] in the previous iteration.
            pal_check[right] = (
                pal_check[right - 1] && // S[left + 1:right - 1]
                S[left] == S[right]           
            );
            // println!("dp[{}][{}] = {}", left, right, pal_check[right]);
        }

        if left + 1 < N { // length 2 palindrome
            pal_check[left + 1] = (S[left] == S[left + 1]);
            // println!("dp[{}][{}] = {}", left, left + 1, pal_check[left + 1]);            
        }

        pal_check[left] = true; // length 1 palindrome trivially satisfied
        return;
    }
}