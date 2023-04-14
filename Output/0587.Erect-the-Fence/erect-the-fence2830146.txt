// https://leetcode.com/problems/erect-the-fence/solutions/2830146/rust-monotone-chain/
use std::collections::HashSet;

pub fn outer_trees(mut points: Vec<Vec<i32>>) -> Vec<Vec<i32>> {
    if points.len() <= 1 {
        return points;
    }

    points.sort_unstable_by_key(|p| to_tuple(p));

    let lower = hull(points.iter().map(|p| to_tuple(p)));
    let upper = hull(points.iter().rev().map(|p| to_tuple(p)));

    let mut unique = HashSet::new();
    lower
        .into_iter()
        .chain(upper.into_iter())
        .filter(|&p| unique.insert(p))
        .map(|p| vec![p.0, p.1])
        .collect()
}

fn hull<I: Iterator<Item = (i32, i32)>>(points: I) -> Vec<(i32, i32)> {
    let mut ans = vec![];

    for p in points {
        loop {
            if ans.len() < 2 {
                break;
            }

            let cp = cross_product(ans[ans.len() - 2], ans[ans.len() - 1], p);
            if cp >= 0 {
                break;
            }

            ans.pop();
        }

        ans.push(p);
    }

    ans
}

// cross product of the vectors x->a and x->b
fn cross_product(o: (i32, i32), a: (i32, i32), b: (i32, i32)) -> i32 {
    (a.0 - o.0) * (b.1 - o.1) - (a.1 - o.1) * (b.0 - o.0)
}

fn to_tuple(p: &[i32]) -> (i32, i32) {
    (p[0], p[1])
}
