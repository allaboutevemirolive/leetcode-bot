// https://leetcode.com/problems/the-skyline-problem/solutions/2641968/rust-clean-and-short-50-lines-idiomatic-solution-with-comments-not-the-fastest-though/
use std::collections::BinaryHeap;
use std::convert::TryFrom;

type BH = BinaryHeap<(i32, i32)>;

fn push(v: Vec<i32>, rez: &mut Vec<Vec<i32>>, h: &mut BH, max: i32) -> i32 {
    let [left, right, height] = <[_; 3]>::try_from(v).unwrap();
    h.push((-right, height)); // Minus because we need min heap
    if height > max {
        rez.push(vec![left, height]);
    }
    max.max(height)
}

fn pop(h: &mut BH, max: i32, rez: &mut Vec<Vec<i32>>) -> i32 {
    let (right, height) = h.pop().unwrap();
    if h.is_empty() {
        rez.push(vec![-right, 0]);
        0
    } else if height == max {
        let new_height = h.iter().map(|(_, height)| *height).max().unwrap();
        if new_height < max {
            rez.push(vec![-right, new_height]);
        }
        new_height
    } else {
        max
    }
}

impl Solution {
    pub fn get_skyline(buildings: Vec<Vec<i32>>) -> Vec<Vec<i32>> {
        let mut h: BH = BinaryHeap::new();
        let mut it = buildings.into_iter().peekable();
        let mut rez = Vec::new();
        let mut max = 0;

        loop {
            max = match (it.peek(), h.peek()) {
                (None, None) => break,
                (None, Some(_)) => pop(&mut h, max, &mut rez),
                (Some(_), None) => push(it.next().unwrap(), &mut rez, &mut h, max),
                (Some(v), Some(p)) if v[0] > -p.0 => pop(&mut h, max, &mut rez),
                (Some(_), Some(_)) => push(it.next().unwrap(), &mut rez, &mut h, max),
            }
        }

        // Dedup retains the first matching element, while we need the last
        rez.reverse();
        rez.dedup_by_key(|v| v[0]);
        rez.reverse();
        rez
    }
}