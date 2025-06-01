import { iconsImgs } from "../utils/images";
import { personsImgs } from "../utils/images";

export const navigationLinks = [
    { id: 1, title: 'Home', image: iconsImgs.home },
    { id: 2, title: 'Budget', image: iconsImgs.budget },
    { id: 3, title: 'Transactions', image: iconsImgs.plane },
    { id: 4, title: 'Subscriptions', image: iconsImgs.wallet },
    { id: 5, title: 'Loans', image: iconsImgs.bills },
    { id: 6, title: 'Reports', image: iconsImgs.report },
    { id: 7, title: 'Savings', image: iconsImgs.wallet },
    { id: 8, title: 'Financial Advice', image: iconsImgs.wealth },
    { id: 9, title: 'Account', image: iconsImgs.user },
    { id: 10, title: 'Settings', image: iconsImgs.gears },
    { id: 11, title: 'Theme', image: iconsImgs.theme }
];

export const transactions = [
    {
        id: 11, 
        name: "Mehmet Yalçın",
        image: personsImgs.person_four,
        date: "23/10/24",
        amount: 22000
    },
    {
        id: 12, 
        name: "Hülya Er",
        image: personsImgs.person_three,
        date: "23/07/24",
        amount: 20000
    },
    {
        id: 13, 
        name: "Metin Ertemiz",
        image: personsImgs.person_one,
        date: "23/08/24",
        amount: 30000
    }
];

export const reportData = [
    {
        id: 14,
        month: "Jan",
        value1: 45,
        value2: null
    },
    {
        id: 15,
        month: "Feb",
        value1: 45,
        value2: 60
    },
    {
        id: 16,
        month: "Mar",
        value1: 45,
        value2: null
    },
    {
        id: 17,
        month: "Apr",
        value1: 45,
        value2: null
    },
    {
        id: 18,
        month: "May",
        value1: 45,
        value2: null
    }
];

export const budget = [
    {
        id: 19, 
        title: "Subscriptions",
        type: "Automated",
        amount: 22000
    },
    {
        id: 20, 
        title: "Loan Payment",
        type: "Automated",
        amount: 16000
    },
    {
        id: 21, 
        title: "Foodstuff",
        type: "Automated",
        amount: 20000
    },
    {
        id: 22, 
        title: "Subscriptions",
        type: null,
        amount: 10000
    },
    {
        id: 23, 
        title: "Subscriptions",
        type: null,
        amount: 40000
    }
];

export const subscriptions = [
    {
        id: 24,
        title: "LinkedIn",
        due_date: "23/12/24",
        amount: 20000
    },
    {
        id: 25,
        title: "Netflix",
        due_date: "29/12/24",
        amount: 5000
    },
    {
        id: 26,
        title: "YouTube",
        due_date: "17/02/25",
        amount: 2000
    }
];

export const savings = [
    {
        id: 27,
        image: personsImgs.person_two,
        saving_amount: 250000,
        title: "Buy foreign currency",
        date_taken: "23/12/24",
        amount_left: 50000
    }
]