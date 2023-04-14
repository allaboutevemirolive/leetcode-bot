// https://leetcode.com/problems/data-stream-as-disjoint-intervals/solutions/3107600/rust-btreemap-union-findish/
use std::collections::BTreeMap;
use std::ops::Bound::{Included, Excluded, Unbounded};


#[derive(Debug)]
struct SummaryRanges {
    map: BTreeMap<i32, (i32,i32)>
}

impl SummaryRanges {

    fn new() -> Self {
        Self {
            map: BTreeMap::new()
        }
    }
    
    fn fix_bounds(&mut self, value: i32) {
        let mut to_update = vec![value];
        let mut left_bound = value;
        while let Some( &(left, _) ) = self.map.get(&left_bound) {
            if left == left_bound {
                break;
            }
            to_update.push(left);
            left_bound = left;
        }
    
        let mut right_bound = value;
        while let Some( &(_, right) ) = self.map.get(&right_bound) {
            if right == right_bound {
                break;
            }
            to_update.push(right);
            right_bound = right;
        }
        for v in to_update.into_iter() {
            self.map.insert(v, (left_bound, right_bound));
        }
    }
    
    fn add_num(&mut self, value: i32) {
        if self.map.get(&value).is_some() {
            return;
        }
        let sub_left = if self.map.get(&(value-1)).is_some() {1} else {0};
        let add_right = if self.map.get(&(value+1)).is_some() {1} else {0};
        self.map.insert(value, (value - sub_left, value + add_right));
        self.fix_bounds(value);
    }
    
    fn get_intervals(&self) -> Vec<Vec<i32>> {
        let mut result = vec![];
        let mut query = (Unbounded, Unbounded);
        let mut sentinal = 0;
        while let Some((_, &(left, right))) = self.map.range(query).next() {
            result.push(vec![left, right]);
            sentinal = right;
            query = (Excluded(&sentinal), Unbounded);
        }
        result
    }
}