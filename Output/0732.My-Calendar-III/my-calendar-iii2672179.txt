// https://leetcode.com/problems/my-calendar-iii/solutions/2672179/rust-intuitive-translate-from-solution-i/
use std::collections::BTreeMap;

struct MyCalendarThree {
    inner: BTreeMap<i32, i32>
}


/** 
 * `&self` means the method takes an immutable reference.
 * If you need a mutable reference, change it to `&mut self` instead.
 */
impl MyCalendarThree {

    fn new() -> Self {
        Self {
            inner: BTreeMap::new()
        }
    }
    
    fn book(&mut self, start: i32, end: i32) -> i32 {
        let mut cur: i32 = 0;
        let mut res: i32 = 0;
        
        if let Some(val) = self.inner.get_mut(&start) {
            *val += 1;
        } else {
            self.inner.insert(start, 1);
        }
        
        if let Some(val) = self.inner.get_mut(&end) {
            *val -= 1;
        } else {
            self.inner.insert(end, -1);
        }
        
        for (_, delta) in &self.inner {
            cur += delta;
            res = std::cmp::max(res, cur);
        }
        
        res
    }
}

/**
 * Your MyCalendarThree object will be instantiated and called as such:
 * let obj = MyCalendarThree::new();
 * let ret_1: i32 = obj.book(start, end);
 */