// https://leetcode.com/problems/course-schedule-iii/solutions/2185795/rust-greedy/
use std::collections::BinaryHeap;
/// @author: Leon
/// https://leetcode.com/problems/course-schedule-iii/
/// Time Complexity:    O(`len_n` * lg(`len_n`))
/// Space Complexity:   O(1)
impl Solution {
    pub fn schedule_course(courses: Vec<Vec<i32>>) -> i32 {
        let len_cs: usize = courses.len();
        let sorted: Vec<Vec<i32>> = {
            let mut courses = courses;
            courses.sort_by_key(|e| e[1]);
            courses
        };
        // max heap
        let mut heap: BinaryHeap<i32> = BinaryHeap::new();
        // the running/overrall duration
        let mut sum: i32 = 0;
        for course in sorted{
            let duration = course[0];
            let last_day = course[1];
            heap.push(duration);
            sum += duration;
            if sum > last_day{
                if let Some(top) = heap.pop(){
                    sum -= top;
                }
            }
        }
        heap.len() as i32
    }
}