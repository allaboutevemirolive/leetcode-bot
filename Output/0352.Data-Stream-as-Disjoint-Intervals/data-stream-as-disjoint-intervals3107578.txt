// https://leetcode.com/problems/data-stream-as-disjoint-intervals/solutions/3107578/rust-solution-with-btreeset-and-custom-interval-struct/
use std::cmp::Ordering;
use core::ops::Bound::Included;

#[derive(Eq, Copy, Clone)]
struct Interval { start: i32, end: i32 }
impl PartialEq for Interval { fn eq(&self, other: &Self) -> bool { self.start == other.start } }
impl Ord for Interval { fn cmp(&self, other: &Self) -> Ordering { self.start.cmp(&other.start) } }
impl PartialOrd for Interval { fn partial_cmp(&self, other: &Self) -> Option<Ordering> { Some(self.cmp(other)) } }

impl Interval {
    fn stub(start: i32) -> Self {
        Interval { start, end: 0 }
    }
}

struct SummaryRanges {
    intervals: std::collections::BTreeSet<Interval>,
}


/** 
 * `&self` means the method takes an immutable reference.
 * If you need a mutable reference, change it to `&mut self` instead.
 */
impl SummaryRanges {

    fn new() -> Self {
        let mut intervals = std::collections::BTreeSet::new();
        Self { intervals }
    }
    
    fn add_num(&mut self, value: i32) {
        let mut range = self.intervals.range((Included(&Interval::stub(0)), Included(&Interval::stub(value + 1)))).rev();
        let first = range.next().copied();
        let second = range.next().copied();
        drop(range);
        match (first, second) {
            (Some(it1), Some(it2)) if it1.start == value+1 && it2.end == value-1 => {
                // Merge intervals
                self.intervals.remove(&it1);
                self.intervals.remove(&it2);
                self.intervals.insert(Interval { start: it2.start, end: it1.end });
            },
            (Some(it1), _) if it1.start == value+1 => {
                // Extend it1 left
                self.intervals.remove(&it1);
                self.intervals.insert(Interval { start: value, end: it1.end });
            },
            (Some(it1), _) if it1.end == value-1 => {
                // Extend it1 right
                self.intervals.remove(&it1);
                self.intervals.insert(Interval { start: it1.start, end: value });
            },
            (Some(it1), _) if it1.end >= value => { },
            _ => {
                // Insert new interval
                self.intervals.insert(Interval { start: value, end: value });
            }
        }
    }
    
    fn get_intervals(&self) -> Vec<Vec<i32>> {
        self.intervals.iter().map(|it| vec![it.start, it.end]).collect()
    }
}

/**
 * Your SummaryRanges object will be instantiated and called as such:
 * let obj = SummaryRanges::new();
 * obj.add_num(value);
 * let ret_2: Vec<Vec<i32>> = obj.get_intervals();
 */