// https://leetcode.com/problems/course-schedule-iii/solutions/2187951/rust-priority-queue-max-heap/
use std::cmp::Ordering;
use std::collections::BinaryHeap;

pub fn schedule_course(mut courses: Vec<Vec<i32>>) -> i32 {
    courses.sort_unstable_by(|a, b| match a[1].cmp(&b[1]) {
        Ordering::Less => Ordering::Less,
        Ordering::Greater => Ordering::Greater,
        Ordering::Equal => a[0].cmp(&b[0]),
    });

    let mut end = 0;
    let mut pq = BinaryHeap::new();

    for c in courses.iter() {
        let cost = c[0];
        let deadline = c[1];

        // Fast path: This course is impossible to take, because it requires
        // more days to complete than we have available days. So skip it early
        // in order to avoid pushing & popping & other operations
        if cost > deadline {
            continue;
        }

        end += cost;
        pq.push(cost);

        if deadline < end {
            end -= pq.pop().unwrap();
        }
    }

    pq.len() as i32
}