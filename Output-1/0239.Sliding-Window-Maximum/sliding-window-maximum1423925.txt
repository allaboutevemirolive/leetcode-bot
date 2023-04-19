// https://leetcode.com/problems/sliding-window-maximum/solutions/1423925/rust-o-n-solution-using-monotonic-queue/
use std::collections::VecDeque;

pub struct MonotonicQueue<T> {
    deq: VecDeque<T>,
}

impl<T> MonotonicQueue<T> {
    pub fn new() -> MonotonicQueue<T> {
        MonotonicQueue {
            deq: VecDeque::new(),
        }
    }

    pub fn push_by<F>(&mut self, item: T, is_less: F)
    where
        F: Fn(&T, &T) -> bool,
    {
        while let Some(existing_item) = self.deq.back() {
            if is_less(existing_item, &item) {
                self.deq.pop_back();
            } else {
                break;
            }
        }
        self.deq.push_back(item);
    }

    pub fn peek(&self) -> Option<&T> {
        self.deq.front()
    }

    pub fn pop(&mut self) -> Option<T> {
        self.deq.pop_front()
    }
}

impl Solution {
    pub fn max_sliding_window(nums: Vec<i32>, k: i32) -> Vec<i32> {
        if nums.len() * k as usize == 0 {
            return Vec::new();
        }

        let mut queue = MonotonicQueue::new();
        let is_less = |i1: &usize, i2: &usize| nums[*i1].lt(&nums[*i2]);
        for i in 0..k {
            queue.push_by(i as usize, is_less);
        }

        let mut result = Vec::with_capacity(nums.len());
        // unwrap() is safe as we previously handled an empty input
        result.push(nums[*queue.peek().unwrap()]);
        for i in (k as usize)..nums.len() {
            if *queue.peek().unwrap() == i - k as usize {
                queue.pop();
            }
            queue.push_by(i as usize, is_less);
            result.push(nums[*queue.peek().unwrap()]);
        }
        result
    }
}