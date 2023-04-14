// https://leetcode.com/problems/three-equal-parts/solutions/1343547/rust-solution/
fn lstrip(a: &[i32]) -> &[i32] {
    &a[a.iter().position(|&x| x == 1).unwrap()..]
}

fn find(a: &[i32], ones: i32, tz: usize) -> Option<&[i32]> {
    let x = a.iter()
        .scan(0, |s, &x| { *s += x; Some(*s) })
        .position(|x| x == ones)?;
    Some(&a[..=x + tz]).filter(|a| a[x + 1..].iter().all(|&x| x == 0))
}

fn check(flag: bool) -> Option<()> {
    Some(()).filter(|_| flag)
}

fn solve(a: Vec<i32>) -> Option<Vec<i32>> {
    let ones: i32 = a.iter().sum();
    if ones == 0 {
        return Some(vec![0, 2]);
    }
    check(ones % 3 == 0)?;
    let tz = a.iter().rev().position(|&x| x == 1)?;
    let x = find(&a, ones / 3, tz)?;
    let y = find(&a[x.len()..], ones / 3, tz)?;
    let z = &a[x.len() + y.len()..];
    let lx = lstrip(x);
    check(lx == lstrip(y) && lx == lstrip(z))?;
    Some(vec![(x.len() - 1) as _, (x.len() + y.len()) as _])
}

impl Solution {
    pub fn three_equal_parts(arr: Vec<i32>) -> Vec<i32> {
        solve(arr).unwrap_or(vec![-1, -1])
    }
}