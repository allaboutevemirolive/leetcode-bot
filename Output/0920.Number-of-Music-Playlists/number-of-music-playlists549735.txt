// https://leetcode.com/problems/number-of-music-playlists/solutions/549735/rust-dp-solution/
pub fn num_music_playlists(n: i32, l: i32, k: i32) -> i32 {
    let (n, l, k) = (n as usize, l as usize, k as usize);
    let mut ret = vec![vec![0; l + 1]; n + 1];
    ret[0][0] = 1;
    let m = 1_000_000_007 as usize;
    for i in 1..=n {
        for j in 1..=l {
            ret[i][j] = ret[i-1][j-1] * (n - i + 1);
            if i > k {
                ret[i][j] += ret[i][j-1] * (i - k);
            }
            ret[i][j] %= m;
        }
    }
    ret[n][l] as i32
}