// https://leetcode.com/problems/course-schedule-iii/solutions/2186967/rust-binaryheap-concise/
use std::collections::BinaryHeap;

impl Solution {
    pub fn schedule_course(mut courses: Vec<Vec<i32>>) -> i32 {
        courses.sort_unstable_by(|c1, c2| c1[1].cmp(&c2[1]));
        courses.into_iter().fold((BinaryHeap::<i32>::new(), 0), |(mut pq, mut time), c| {
            let (duration, end_day) = (c[0], c[1]);
            pq.push(duration);
            time += duration;
            if time > end_day {
                time -= pq.pop().unwrap()
            }
            (pq, time)
        }).0.len() as i32
    }
}