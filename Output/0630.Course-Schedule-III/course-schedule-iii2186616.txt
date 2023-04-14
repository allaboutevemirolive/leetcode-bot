// https://leetcode.com/problems/course-schedule-iii/solutions/2186616/rust-binaryheap-solution/
use std::collections::BinaryHeap;

impl Solution {
    pub fn schedule_course(mut courses: Vec<Vec<i32>>) -> i32 {
        let mut sum = 0;
        let mut heap = BinaryHeap::new();
        courses.sort_by_key(|a| a[1]);

        (0..courses.len()).map(|x| &courses[x]).for_each(|e| {
            sum += e[0];
            heap.push(e[0]);
            sum -= if sum > e[1] { heap.pop().unwrap() } else { 0 };
        });
        heap.len() as i32
    }
}