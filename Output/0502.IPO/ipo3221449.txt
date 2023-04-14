// https://leetcode.com/problems/ipo/solutions/3221449/go-rust-greedy-heap-sorting/
use std::collections::BinaryHeap;
impl Solution {
    pub fn find_maximized_capital(k: i32, w: i32, profits: Vec<i32>, capital: Vec<i32>) -> i32 {
        match Iterator::zip(profits.into_iter(), capital.into_iter()).collect::<Vec<(i32, i32)>>() {
            mut pc => {
                pc.sort_unstable_by_key(|&(_, c)| c);
                match (BinaryHeap::new(), 0) {
                    h => match (1..=k).try_fold((h, w), |((avail, i), w), _| {
                        match (i..pc.len()).try_fold((avail, i), |(mut avail, i), _| {
                            match pc[i].1 <= w {
                                true => Ok({
                                    avail.push(pc[i].0);
                                    (avail, i + 1)
                                }),
                                false => Err((avail, i)),
                            }
                        }) {
                            Ok((mut avail, i)) | Err((mut avail, i)) => match avail.pop() {
                                None => Err(w),
                                Some(p) => Ok(((avail, i), w + p)),
                            },
                        }
                    }) {
                        Ok((_, w)) | Err(w) => w,
                    },
                }
            }
        }
    }
}