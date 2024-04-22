import { client } from "./connection.mjs";

const initStrokesData = async () => {
  const query = `BEGIN BATCH
    INSERT INTO Strokes (strokeID, username, email, coordinates, color, weight, time)
VALUES 
  (uuid(), 'JohnDoe', 'john@example.com',
    [{x: 10, y: 20}, {x: 15, y: 25}, {x: 20, y: 30}, {x: 25, y: 35}, {x: 30, y: 40},
     {x: 35, y: 45}, {x: 40, y: 50}, {x: 45, y: 55}, {x: 50, y: 60}, {x: 55, y: 65},
     {x: 60, y: 70}, {x: 65, y: 75}, {x: 70, y: 80}, {x: 75, y: 85}, {x: 80, y: 90},
     {x: 85, y: 95}, {x: 90, y: 100}, {x: 95, y: 105}, {x: 100, y: 110}, {x: 105, y: 115}],
    (255, 0, 0), 2, '2022-04-01 10:00:00');

    INSERT INTO Strokes (strokeID, username, email, coordinates, color, weight, time)
VALUES 
  (uuid(), 'JaneSmith', 'jane@example.com',
    [{x: -5, y: 15}, {x: -10, y: 10}, {x: -15, y: 5}, {x: -20, y: 0}, {x: -25, y: -5},
     {x: -30, y: -10}, {x: -35, y: -15}, {x: -40, y: -20}, {x: -45, y: -25}, {x: -50, y: -30},
     {x: -55, y: -35}, {x: -60, y: -40}, {x: -65, y: -45}, {x: -70, y: -50}, {x: -75, y: -55},
     {x: -80, y: -60}, {x: -85, y: -65}, {x: -90, y: -70}, {x: -95, y: -75}, {x: -100, y: -80}],
    (0, 0, 255), 3, '2022-04-02 15:30:00');
    
    INSERT INTO Strokes (strokeID, username, email, coordinates, color, weight, time)
    VALUES 
    (uuid(), 'Alice', 'alice@example.com',
    [{x: 30, y: 40}, {x: 35, y: 45}, {x: 40, y: 50}, {x: 45, y: 55}, {x: 50, y: 60},
     {x: 55, y: 65}, {x: 60, y: 70}, {x: 65, y: 75}, {x: 70, y: 80}, {x: 75, y: 85},
     {x: 80, y: 90}, {x: 85, y: 95}, {x: 90, y: 100}, {x: 95, y: 105}, {x: 100, y: 110},
     {x: 105, y: 115}, {x: 110, y: 120}, {x: 115, y: 125}, {x: 120, y: 130}, {x: 125, y: 135}],
    (128, 0, 128), 4, '2022-04-03 12:00:00');

    INSERT INTO Strokes (strokeID, username, email, coordinates, color, weight, time)
VALUES 
  (uuid(), 'Bob', 'bob@example.com',
    [{x: 0, y: 0}, {x: 5, y: 5}, {x: 10, y: 10}, {x: 15, y: 15}, {x: 20, y: 20},
     {x: 25, y: 25}, {x: 30, y: 30}, {x: 35, y: 35}, {x: 40, y: 40}, {x: 45, y: 45},
     {x: 50, y: 50}, {x: 55, y: 55}, {x: 60, y: 60}, {x: 65, y: 65}, {x: 70, y: 70},
     {x: 75, y: 75}, {x: 80, y: 80}, {x: 85, y: 85}, {x: 90, y: 90}, {x: 95, y: 95}],
    (0, 128, 0), 5, '2022-04-04 09:00:00');

    INSERT INTO Strokes (strokeID, username, email, coordinates, color, weight, time)
VALUES 
(uuid(), 'Eva', 'eva@example.com',
[{x: -20, y: -20}, {x: -15, y: -15}, {x: -10, y: -10}, {x: -5, y: -5}, {x: 0, y: 0},
 {x: 5, y: 5}, {x: 10, y: 10}, {x: 15, y: 15}, {x: 20, y: 20}, {x: 25, y: 25},
 {x: 30, y: 30}, {x: 35, y: 35}, {x: 40, y: 40}, {x: 45, y: 45}, {x: 50, y: 50},
 {x: 55, y: 55}, {x: 60, y: 60}, {x: 65, y: 65}, {x: 70, y: 70}, {x: 75, y: 75}],
(255, 128, 0), 6, '2022-04-05 14:00:00');

INSERT INTO Strokes (strokeID, username, email, coordinates, color, weight, time)
VALUES 
(uuid(), 'Sarah', 'sarah@example.com',
[{x: -95, y: -95}, {x: -90, y: -90}, {x: -85, y: -85}, {x: -80, y: -80}, {x: -75, y: -75},
 {x: -70, y: -70}, {x: -65, y: -65}, {x: -60, y: -60}, {x: -55, y: -55}, {x: -50, y: -50},
 {x: -45, y: -45}, {x: -40, y: -40}, {x: -35, y: -35}, {x: -30, y: -30}, {x: -25, y: -25},
 {x: -20, y: -20}, {x: -15, y: -15}, {x: -10, y: -10}, {x: -5, y: -5}, {x: 0, y: 0}],
(255, 255, 0), 7, '2022-04-06 11:30:00');

    APPLY BATCH;`;

    client.execute(query);
  };
  
  const initUserData = async () => {
    const query = `BEGIN BATCH
    
    INSERT INTO Users (userID, username, email) VALUES (uuid(), 'JohnDoe', 'john@example.com');
    
  INSERT INTO Users (userID, username, email) VALUES (uuid(), 'JaneSmith', 'jane@example.com');
  
  INSERT INTO Users (userID, username, email) VALUES (uuid(), 'Alice', 'alice@example.com');
  
  INSERT INTO Users (userID, username, email) VALUES (uuid(), 'Bob', 'bob@example.com');
  
  INSERT INTO Users (userID, username, email) VALUES (uuid(), 'Eva', 'eva@example.com');
  
  INSERT INTO Users (userID, username, email) VALUES (uuid(), 'Sarah', 'sarah@example.com');
  
  APPLY BATCH;`;

  client.execute(query);
}

const initData = async () => {
  console.log("inserting data");
  initStrokesData();
  initUserData();
}

export default initData;