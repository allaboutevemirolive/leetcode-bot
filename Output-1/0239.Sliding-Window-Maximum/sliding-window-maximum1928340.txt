// https://leetcode.com/problems/sliding-window-maximum/solutions/1928340/rust-using-priorityqueue/
use std::collections::BinaryHeap;

impl Solution {
    pub fn max_sliding_window(nums: Vec<i32>, k: i32) -> Vec<i32> {
        // guards for valid input
        let result_len = nums.len() as i32 - k + 1;
        if result_len < 1 {
            return vec![];
        }
        let k = k as usize;
        let result_len = result_len as usize;

        // Heap is sorted lexicographically: by first tuple member, then by second
        let mut pq: BinaryHeap<(i32, usize)> = BinaryHeap::with_capacity(2*k);
        let mut result = Vec::with_capacity(result_len);

        // O(n) time for loop
        for (i, &num) in nums.iter().enumerate() {

            // O(1) time
            pq.push((num, i));

            // We should hit the first window
            if i < k - 1 {
                continue;
            }

            // Remove values from PQ while they are behind current window
            // O(1) time for peek
            while let Some(&(val, pos)) = pq.peek() {
                // The first value inside window is the max of the current window
                if pos + k > i {
                    result.push(val);
                    break;
                }
                // O(logn) time in the worst case
                pq.pop();
            };
        }
        result
    }
}