// https://leetcode.com/problems/candy/solutions/1922327/easy-rust-solution-divide-conquer/
use std::cmp;

fn main() {
    assert_eq!(candy(&[1,2,2]), 4);
    assert_eq!(candy(&[1,0,2]), 5);
}

pub fn candy<T: AsRef<[i32]>>(ratings: T) -> i32 {
    let (x, _, _) = candy_impl(&ratings);
    x
}

// returns (required count, the number the first child got, the number the last child got)
fn candy_impl<T: AsRef<[i32]>>(ratings: T) -> (i32, i32, i32) {
    let ratings = ratings.as_ref();

    let len = ratings.len();

    if len == 1 {
        return (1, 1, 1);
    } else if len == 2 {
        return match ratings[0].cmp(&ratings[1]) {
            cmp::Ordering::Equal => (2, 1, 1),
            cmp::Ordering::Less => (3, 1, 2),
            cmp::Ordering::Greater =>  (3, 2, 1),
        }
    }

    for (idx, window) in ratings.windows(3).enumerate() {
    	// find a peak
        if window[1] >= window[0] && window[1] >= window[2] {
            let (v1, s1, e1) = candy_impl(&ratings[..idx+2]);
            let (v2, s2, e2) = candy_impl(&ratings[idx+1..]);
            return (v1 + v2 - cmp::min(e1, s2), s1, e2);
		// find a valley
        } else if window[1] <= window[0] && window[1] <= window[2] {
            let (v1, s1, e1) = candy_impl(&ratings[..idx+2]);
            let (v2, _, e2) = candy_impl(&ratings[idx+1..]);
            // return (v1 + v2 - cmp::max(e1, s2), s1, e2); // s2 and e1 must be the same
            return (v1 + v2 - e1, s1, e2);
        }
    }

	// otherwise, the array is strictly monotonically increasing
    let max = len as i32;
    if ratings[0] < ratings[1] {
        ((max+1)*max/2, 1, max)
    } else {
        ((max+1)*max/2, max, 1)
    }
}