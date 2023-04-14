// https://leetcode.com/problems/merge-k-sorted-lists/solutions/3287919/rust-thread-pool-mpsc-channels/
use std::cmp::Ordering;
use std::collections::VecDeque;
use std::sync::mpsc::{channel, Sender};
use std::thread;

const MAX_WORKERS: usize = 8;

type NodeOpt = Option<Box<ListNode>>;
type JobSender = Sender<(NodeOpt, NodeOpt)>;

impl Solution {
    pub fn merge_k_lists(lists: Vec<NodeOpt>) -> NodeOpt {
        let mut lists = lists.into_iter()
                             .filter(Option::is_some)
                             .collect::<VecDeque<_>>();

        if !lists.is_empty() {
            let n_workers = MAX_WORKERS.min(lists.len() / 2);

            let mut th_chans = Vec::<JobSender>::with_capacity(n_workers);
            let (main_tx, main_rx) = channel::<(usize, NodeOpt)>();

            for id in 0..n_workers {
                // Set up channels for the next thread.
                let (th_tx, th_rx) = channel();
                let main_tx = main_tx.clone();

                th_chans.push(th_tx);

                thread::spawn(move || {
                    // Receive two lists for merging.
                    while let Ok((mut l1, mut l2)) = th_rx.recv() {
                        let mut l3 = None;
                        let mut t3 = &mut l3;
                        // Merge the two lists.
                        loop {
                            match (&l1, &l2) {
                                (Some(n1), Some(n2)) => {
                                    if n1.val < n2.val {
                                        *t3 = l1.take();
                                        t3 = &mut t3.as_mut().unwrap().next;
                                        l1 = t3.take();
                                    } else {
                                        *t3 = l2.take();
                                        t3 = &mut t3.as_mut().unwrap().next;
                                        l2 = t3.take();
                                    }
                                },
                                (Some(_), None) => { *t3 = l1.take(); },
                                (None, Some(_)) => { *t3 = l2.take(); },
                                _ => break,
                            }   
                        }
                        // Send the merged list back to the main thread.
                        main_tx.send((id, l3)).unwrap();
                    }
                });
            }
            let mut pairs_recv = lists.len() - 1;
            let mut wkr_ids = (0..n_workers).collect::<Vec<_>>();

            while pairs_recv > 0 {
                // Send pairs of lists for merging to the idle threads.
                while !wkr_ids.is_empty() && lists.len() > 1 {
                    let l1 = lists.pop_front().unwrap();
                    let l2 = lists.pop_front().unwrap();
                    th_chans[wkr_ids.pop().unwrap()].send((l1, l2));
                }
                // Receive merged lists from the pool.
                if pairs_recv > 0 {
                    let (id, list) = main_rx.recv().unwrap();
                    lists.push_back(list);
                    wkr_ids.push(id);
                    pairs_recv -= 1;
                    while let Ok((id, list)) = main_rx.try_recv() {
                        lists.push_back(list);
                        wkr_ids.push(id);
                        pairs_recv -= 1;
                    }
                }
            }
            lists.pop_front().unwrap()
        } 
        else { None }
    }
}