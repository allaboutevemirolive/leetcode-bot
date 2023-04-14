// https://leetcode.com/problems/my-calendar-iii/solutions/2671807/rust-solution/
use std::collections::BTreeMap;

#[derive(Default)]
struct MyCalendarThree {
    data: BTreeMap<i32, i32>,
    ans: i32,
}

impl MyCalendarThree {
    fn new() -> Self {
        Default::default()
    }

    fn split(&mut self, x: i32) {
        let y = self.data.range(..=x).next_back().map_or(0, |(_, &y)| y);
        self.data.insert(x, y);
    }

    fn book(&mut self, start: i32, end: i32) -> i32 {
        self.split(start);
        self.split(end);
        for (_, y) in self.data.range_mut(start..end) {
            *y += 1;
            self.ans = self.ans.max(*y);
        }
        self.ans
    }
}