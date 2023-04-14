// https://leetcode.com/problems/data-stream-as-disjoint-intervals/solutions/3108580/rust-o-n-o-1-bitfield-counting-sort-8ms-7-2mb/
struct SummaryRanges {
    segs: [u64; 160],
    minv: i32,
    maxv: i32,
}

impl SummaryRanges {

    fn new() -> Self {
        Self { segs: [0; 160], minv: i32::MAX, maxv: i32::MIN }
    }
    
    fn add_num(&mut self, value: i32) {
        self.minv = self.minv.min(value);
        self.maxv = self.maxv.max(value);
        let seg = value as usize / 64;
        let shf = value as usize % 64;
        self.segs[seg] |= 1 << shf;
    }

    fn get_intervals(&self) -> Vec<Vec<i32>> {
        let mut ranges = vec![];
        let mut wrap   = false;
        let     minseg = self.minv / 64;
        let     maxseg = self.maxv / 64 + 1;
        let mut i      = 0;
        let mut last_i = 0;

        for seg_i in minseg..=maxseg {
            let mut seg = self.segs[seg_i as usize];
            let     lim = seg_i * 64 + 64;

            i = seg_i * 64;

            if wrap && seg & 1 == 0 {
                ranges.push(vec![last_i, i - 1]);
            }
            
            while seg != 0 {
                // Pass up contiguous 0's.
                while seg != 0 && seg & 1 == 0 {
                    seg >>= 1;
                    i += 1;
                    last_i = i;
                }
                // Get contiguous 1's.
                while seg & 1 == 1 {
                    seg >>= 1;
                    i += 1;
                }
                if i < lim && last_i != i {
                    ranges.push(vec![last_i, i - 1]);
                }
            }
            if i < lim { 
                last_i = lim; 
                wrap = false; 
            } else { 
                wrap = true;  
            }
        }
        ranges
    }
}