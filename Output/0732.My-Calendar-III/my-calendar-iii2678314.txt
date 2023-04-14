// https://leetcode.com/problems/my-calendar-iii/solutions/2678314/rust-btreemap-beats-100-20ms/
use std::collections::BTreeMap;
use std::iter::{FromIterator, once};

struct MyCalendarThree {
    data: BTreeMap<i32, i32>,
    max: i32
}


/** 
 * `&self` means the method takes an immutable reference.
 * If you need a mutable reference, change it to `&mut self` instead.
 */
impl MyCalendarThree {
    fn new() -> Self {
        MyCalendarThree {
            data: BTreeMap::from_iter(once((0, 0))),
            max: 0i32,
        }
    }

    fn book(&mut self, start: i32, end: i32) -> i32 {
        let mut r = &mut self.max;
        let mut cur = *self.data.range(..=start).rev().next().unwrap().1;

        self.data.entry(start).or_insert(cur);
        for (_, v) in self.data.range_mut(start..end) {
            cur = *v;
            *v += 1;
            *r = std::cmp::max(*r, *v);
        }
        self.data.entry(end).or_insert(cur);

        *r
    }
}