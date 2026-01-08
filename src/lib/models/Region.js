var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
let Region = class Region {
    id;
    uniqId;
    name;
    country;
    season;
    link;
};
__decorate([
    PrimaryGeneratedColumn(),
    __metadata("design:type", String)
], Region.prototype, "id", void 0);
__decorate([
    Column(),
    __metadata("design:type", String)
], Region.prototype, "uniqId", void 0);
__decorate([
    Column(),
    __metadata("design:type", String)
], Region.prototype, "name", void 0);
__decorate([
    Column({ nullable: true }),
    __metadata("design:type", String)
], Region.prototype, "country", void 0);
__decorate([
    Column({ nullable: true }),
    __metadata("design:type", String)
], Region.prototype, "season", void 0);
__decorate([
    Column({ nullable: true }),
    __metadata("design:type", String)
], Region.prototype, "link", void 0);
Region = __decorate([
    Entity('regions')
], Region);
export { Region };
// Picture: null,
// country: 'Германия',
// hash: '1288827035',
// info: null,
// lat: 49.5458577142,
// lng: 11.1205914617,
// maplat: 49.406577694,
// maplng: 11.5139223263,
// name: 'Frankenjura',
// season: 'Сезон: <b>мар - ноя</b>',
// web_guide_link: '/ru/guides/frankenjura/',
// zoom: 8.00796508789
