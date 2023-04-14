// https://leetcode.com/problems/my-calendar-iii/solutions/2673278/rust-btreemap/
use std::collections::BTreeMap;

struct MyCalendarThree {
    map: BTreeMap<i32, i32>
}


/** 
 * `&self` means the method takes an immutable reference.
 * If you need a mutable reference, change it to `&mut self` instead.
 */
impl MyCalendarThree {

    fn new() -> Self {
        Self {
            map: BTreeMap::new()
        }
    }
    
    fn book(&mut self, start: i32, end: i32) -> i32 {
        self.map.entry(start).and_modify(|diff| *diff += 1).or_insert(1);
        self.map.entry(end).and_modify(|diff| *diff -= 1).or_insert(-1);
        
        let (mut res, mut curr) = (0, 0);
        for delta in self.diff.values() {
            curr += delta;
            res = std::cmp::max(res, curr);
        }
        res
    }
}