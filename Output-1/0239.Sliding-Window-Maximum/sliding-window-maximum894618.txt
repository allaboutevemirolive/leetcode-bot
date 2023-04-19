// https://leetcode.com/problems/sliding-window-maximum/solutions/894618/rust-simple-solution-using-deque/
use std::collections::VecDeque;

impl Solution {
    pub fn max_sliding_window(nums: Vec<i32>, k: i32) -> Vec<i32> {
        let mut deque: VecDeque<usize> = VecDeque::new();
        let mut output: Vec<i32> = Vec::new();
        let k = k as usize;

        // Initialize deque with first window
        for i in 0..k {
            while !deque.is_empty() && nums[i] >= nums[deque.back().unwrap().clone()] {
                deque.pop_back();
            }

            deque.push_back(i);
        }

        // First window max is at the front of the deque
        output.push(nums[*deque.front().unwrap()]);

        // We repeat the above for each successive window, with the added change that
        // we need to prune out values from the front of the list that are not
        // in the current window.
        for i in k..nums.len() {
            // Remove elements that are not part of this window
            while !deque.is_empty() && deque.front().unwrap().clone() <= i - k {
                deque.pop_front();
            }

            // Remove all values from the back of the deque that are smaller than this
            // one
            while !deque.is_empty() && nums[i] >= nums[deque.back().unwrap().clone()] {
                deque.pop_back();
            }

            // Push current value to the back
            deque.push_back(i);

            // The front is now the max for this window
            output.push(nums[*deque.front().unwrap()]);
        }

        output
    }
}