// https://leetcode.com/problems/rectangle-area-ii/solutions/218078/canvas-painting-in-rust/
use std::cmp;
use std::collections::BTreeSet;

impl Solution {
    pub fn rectangle_area(rectangles: Vec<Vec<i32>>) -> i32 {
        let mut xs = BTreeSet::new();
        let mut ys = BTreeSet::new();
        for rec in rectangles.iter() {
            xs.insert(rec[0]); xs.insert(rec[2]);
            ys.insert(rec[1]); ys.insert(rec[3]);
        }
        // BTreeSet makes sure that all values are sorted
        let xs: Vec<i32> = xs.iter().map(|x| *x).collect();
        let ys: Vec<i32> = ys.iter().map(|y| *y).collect();
        
        let mut canvas = vec![vec![false; ys.len()]; xs.len()];
        let mut area: i32 = 0;
        
        for rec in rectangles.iter() {
            let mut xi = xs.binary_search(&rec[0]).unwrap();
            for xi in (xi..).take_while(|xi| xs[*xi] != rec[2]) {
                let mut yi = ys.binary_search(&rec[1]).unwrap();
                for yi in (yi..).take_while(|yi| ys[*yi] != rec[3]) {
                    if canvas[xi][yi] {
                        // the pixel is already painted
                        continue;
                    }
                    canvas[xi][yi] = true;
                    let rec_area = (xs[xi+1] as i64 - xs[xi] as i64) * (ys[yi+1] as i64 - ys[yi] as i64) % 1000000007;
                    area = (area + rec_area as i32) % 1000000007;
                }
            }
        }
        
        area
    }
}