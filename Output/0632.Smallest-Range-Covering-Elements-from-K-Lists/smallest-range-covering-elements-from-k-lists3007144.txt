// https://leetcode.com/problems/smallest-range-covering-elements-from-k-lists/solutions/3007144/rust-easy-two-heaps-method/
use std::collections::BinaryHeap;
use std::cmp::Reverse;

impl Solution {
    pub fn smallest_range(nums: Vec<Vec<i32>>) -> Vec<i32> {
        let mut input = vec![];
        let mut min_heap = BinaryHeap::new();
        let mut max_heap = BinaryHeap::new();
        let mut range = i32::MAX;
        let mut res = vec![0, 0];

        // Reverse the input to get better performance at pop()
        for v in nums {
            input.push(v.into_iter().rev().collect::<Vec<i32>>());
        }

        // Put the smallest element to min/max heaps for each list
        for i in 0..input.len() {
            let val = input[i].pop().unwrap();
            min_heap.push((Reverse(val), i));
            max_heap.push(val);
        }

        while min_heap.len() == input.len() {
            // Pop the smallest element from min heap
            let (min, next) = min_heap.pop().unwrap();
            // Peek the largest element from max heap
            let max = *max_heap.peek().unwrap();

            // Update the smallest range
            if range > max - min.0 {
                range = max - min.0;
                res[0] = min.0;
                res[1] = max;
            }

            // Extract next value and push it to heaps
            if let Some(val) = input[next].pop() {
                min_heap.push((Reverse(val), next));
                max_heap.push(val);
            }
        }

        res
    }
}