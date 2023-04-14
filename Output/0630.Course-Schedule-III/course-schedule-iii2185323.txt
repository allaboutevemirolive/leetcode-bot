// https://leetcode.com/problems/course-schedule-iii/solutions/2185323/rust-binaryheap-greedy/
use std::collections::BinaryHeap;

impl Solution {
    pub fn schedule_course(mut courses: Vec<Vec<i32>>) -> i32 {
        // [i][0] is duration and [i][1] is lastDay
        courses.sort_unstable_by(|a,b| a[1].cmp(&b[1]));
        let mut sched: BinaryHeap<i32> = BinaryHeap::new();
        let mut sched_total = 0;
        for course in courses.into_iter() {
            let (duration, last_day) = (course[0], course[1]);
            if sched_total + duration <= last_day {
                sched_total += duration;
                sched.push(duration);
				continue;
            }
			if let Some(mut peak) = sched.peek_mut() {
                let longest: i32 = *peak;
                if longest > duration {
                    sched_total = sched_total - longest + duration;
                    *peak = duration;
                }
            }
        }
        sched.len() as i32
    }
}