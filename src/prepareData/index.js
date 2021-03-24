function sort(arr, property, asc = false) {
    return arr.sort((a, b) => {
        const isName = !`${a[property]}`.match(/\d+/g);
        const c = isName ? a[property].toLowerCase() : Number(`${a[property]}`.match(/\d+/g));
        const d = isName ? b[property].toLowerCase() : Number(`${b[property]}`.match(/\d+/g));
        if (c > d) {
            return asc ? 1 : -1;
        }
        if (d > c) {
            return asc ? -1 : 1;
        }
        return 0;
    });
}

function wordCommit(n, words) {
    const a = Math.abs(n) % 100;
    const b = Math.abs(n) % 10;
    if (a > 10 && a < 20) {
        return words[2];
    }
    if (b > 1 && b < 5) {
        return words[1];
    }
    if (b == 1) {
        return words[0];
    }
    return words[2];
}

function commitsOfSprint(commits, startAt, finishAt) {
    return commits.filter((item) => {
        const { timestamp } = item;
        return startAt <= timestamp && timestamp <= finishAt;
    });
}

function commitsGroupBySize(elements, files) {
    return elements.reduce(
        (acc, elem) => {
            const { summaries } = elem;
            const commitQuantity = files
                .filter((item) => summaries.includes(item.id))
                .map((item) => item.added + item.removed)
                .reduce((acc, item) => acc + item, 0);
            switch (true) {
                case commitQuantity > 1001:
                    ++acc["> 1001 строки"];
                    break;
                case commitQuantity > 500 && commitQuantity <= 1000:
                    ++acc["501 — 1000 строк"];
                    break;
                case commitQuantity > 100 && commitQuantity <= 500:
                    ++acc["101 — 500 строк"];
                    break;
                case commitQuantity >= 0 && commitQuantity <= 100:
                    ++acc["1 — 100 строк"];
                    break;
                default:
                    console.log(commitQuantity);
                    break;
            }
            return acc;
        },
        {
            "> 1001 строки": 0,
            "501 — 1000 строк": 0,
            "101 — 500 строк": 0,
            "1 — 100 строк": 0,
            countCommits: elements.length,
        }
    );
}

function renderCategory(rowCount, size) {
    const current = size[1][rowCount];
    const prev = size[0] ? size[0][rowCount] : 0;
    return {
        title: rowCount,
        valueText: `${current} ${wordCommit(current, ["коммит", "коммита", "коммитов"])}`,
        differenceText: `${current > prev ? "+" : current < prev ? "-" : ""}${Math.abs(current - prev)} ${wordCommit(current - prev, [
            "коммит",
            "коммита",
            "коммитов",
        ])}`,
    };
}

function prepareData(entities, { sprintId }) {
    const currentSprint = entities.find((item) => item.type === "Sprint" && item.id === sprintId);
    const { name, startAt, finishAt } = currentSprint;
    console.log(currentSprint);
    let [users, sprints, comments, commits, allSummaries] = [[], [], [], [], []];

    // Формирование массивов данных по типу
    entities.forEach((item) => {
        const { type, createdAt, author, summaries } = item;
        if (type === "User") users.push(item);
        if (type === "Sprint") sprints.push(item);
        if (type === "Comment" && startAt <= createdAt && createdAt <= finishAt) {
            item.author = typeof author === "object" ? author.id : author;
            comments.push(item);
        }
        if (type === "Commit") {
            item.author = typeof author === "object" ? author.id : author;
            item.summaries = summaries.map((fileId) => {
                return typeof fileId === "object" ? fileId.id : fileId;
            });
            commits.push(item);
        }
        if (type === "Summary") allSummaries.push(item);
    });

    // Сортировка спринтов по возрастанию id
    sprints = sort(sprints, "id", true);

    // Сортировка пользователей по возрастанию id
    users = sort(users, "id", true);

    //Vote
    const userLikes = comments.reduce((acc, item) => {
        let { author, likes } = item;
        if (likes) {
            acc[author] = (acc[author] ? acc[author] : 0) + likes.length;
        }
        return acc;
    }, {});

    const usersVote = users.map((item) => {
        const { id, name, avatar } = item;
        return { id, name, avatar, valueText: `${userLikes[id]} ${wordCommit(userLikes[id], ["голос", "голоса", "голосов"])}` };
    });

    const vote = {
        alias: "vote",
        data: {
            title: "Самый внимательный разработчик",
            subtitle: name,
            emoji: "🔎",
            users: sort(usersVote, "valueText"),
        },
    };

    //Leaders
    const commitsOfCurrentSprint = commitsOfSprint(commits, startAt, finishAt);
    const userCommit = commitsOfCurrentSprint.reduce((acc, item) => {
        let { author } = item;
        acc[author] = (acc[author] ? acc[author] : 0) + 1;
        return acc;
    }, {});

    const usersCommit = users.reduce((acc, item) => {
        const { id, name, avatar } = item;
        if (userCommit[id]) {
            acc = [...acc, { id, name, avatar, valueText: `${userCommit[id]}` }];
        }
        return acc;
    }, []);

    // console.log(usersCommit);
    // //Черновое
    // //--------------------------------------------------------------------
    // const userCommitChern = commits.reduce((acc, item) => {
    //     let { author } = item;
    //     acc[author] = (acc[author] ? acc[author] : 0) + 1;
    //     return acc;
    // }, {});
    // const userAllCommit = users.reduce((acc, item) => {
    //     return acc + userCommitChern[item.id];
    // }, 0);
    // console.log(userAllCommit);

    // const sprintsCommit1 = sprints.reduce((acc, item) => {
    //     const { startAt, finishAt } = item;
    //     return acc + commitsOfSprint(commits, startAt, finishAt).length;
    // }, 0);
    // console.log(sprintsCommit1);

    // const res = sort(sprints, "id", true).reduce((acc, item) => {
    //     const { startAt, finishAt } = item;
    //     const userCommit1 = commitsOfSprint(commits, startAt, finishAt).reduce((acc, item) => {
    //         let { author } = item;
    //         acc[author] = (acc[author] ? acc[author] : 0) + 1;
    //         return acc;
    //     }, {});
    //     console.log(item.id, userCommit1);
    //     const summ = users.reduce((acc, elem) => {
    //         return acc + userCommit1[elem.id];
    //     }, 0);
    //     acc[item.name] = summ;
    //     return acc;
    // }, {});
    // console.log(res);

    //--------------------------------------------------------------------

    const leaders = {
        alias: "leaders",
        data: {
            title: "Больше всего коммитов",
            subtitle: name,
            emoji: "👑",
            users: sort(usersCommit, "valueText"),
        },
    };

    //Chart
    const sprintsCommit = sprints.map((item) => {
        const { id, name, startAt, finishAt } = item;
        const itemSprint = { title: `${id}`, hint: name, value: commitsOfSprint(commits, startAt, finishAt).length };
        if (id === sprintId) itemSprint["active"] = true;
        return itemSprint;
    });
    const chart = {
        alias: "chart",
        data: {
            title: "Коммиты",
            subtitle: name,
            values: sprintsCommit,
            users: sort(usersCommit, "valueText"),
        },
    };

    //Diagram
    const currentSprintIndex = sprints.findIndex((item) => item.id === sprintId);
    const prevSprintIndex = currentSprintIndex - 1;
    const commitPrevNext = [sprints[prevSprintIndex], currentSprint].reduce((acc, item) => {
        if (item) {
            const { startAt, finishAt } = item;
            acc = [...acc, commitsGroupBySize(commitsOfSprint(commits, startAt, finishAt), allSummaries)];
        } else acc = [...acc, 0];
        return acc;
    }, []);
    console.log(commitPrevNext);
    const totalText = commitPrevNext[1]["countCommits"];
    const differenceText = commitPrevNext[1]["countCommits"] - (commitPrevNext[0] ? commitPrevNext[0]["countCommits"] : 0);
    const diagram = {
        alias: "diagram",
        data: {
            title: "Размер коммитов",
            subtitle: name,
            totalText: `${totalText} ${wordCommit(totalText, ["коммит", "коммита", "коммитов"])}`,
            differenceText: `${differenceText > 0 ? "+" : differenceText < 0 ? "-" : ""}${Math.abs(differenceText)} с прошлого спринта`,
            categories: [
                renderCategory("> 1001 строки", commitPrevNext),
                renderCategory("501 — 1000 строк", commitPrevNext),
                renderCategory("101 — 500 строк", commitPrevNext),
                renderCategory("1 — 100 строк", commitPrevNext),
            ],
        },
    };

    //Activity
    const dataBase = { sun: [], mon: [], tue: [], wed: [], thu: [], fri: [], sat: [] };
    for (key in dataBase) {
        for (i = 0; i < 24; i++) {
            dataBase[key].push(0);
        }
    }
    const data = commitsOfCurrentSprint.reduce((acc, item) => {
        const { timestamp } = item;
        const date = new Date(timestamp);
        const day = date.toLocaleString("en", { weekday: "short", timeZone: "Europe/Moscow" }).toLowerCase();
        const hour = Number(date.toLocaleString("en", { hour12: false, hour: "numeric", timeZone: "Europe/Moscow" }));
        acc[day][hour] = acc[day][hour] ? ++acc[day][hour] : 1;
        return acc;
    }, dataBase);
    const activity = {
        alias: "activity",
        data: {
            title: "Коммиты",
            subtitle: name,
            data: data,
        },
    };

    // console.log(users);
    console.log(sprints);
    // console.log(leaders);
    // console.log(vote);
    // console.log(chart);
    // console.log(diagram);
    // console.log(data);
    const result = [vote, leaders, chart, diagram, activity];
    return result;
}

module.exports = { prepareData };
