var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, Index } from 'typeorm';
let Sector = class Sector {
    id;
    uniqId;
    name;
    numroutes;
    link;
    placeId;
    place;
};
__decorate([
    PrimaryGeneratedColumn(),
    __metadata("design:type", String)
], Sector.prototype, "id", void 0);
__decorate([
    Column(),
    __metadata("design:type", String)
], Sector.prototype, "uniqId", void 0);
__decorate([
    Column(),
    __metadata("design:type", String)
], Sector.prototype, "name", void 0);
__decorate([
    Column({ nullable: true }),
    __metadata("design:type", Number)
], Sector.prototype, "numroutes", void 0);
__decorate([
    Column({ nullable: true }),
    __metadata("design:type", String)
], Sector.prototype, "link", void 0);
__decorate([
    Column(),
    Index(),
    __metadata("design:type", String)
], Sector.prototype, "placeId", void 0);
__decorate([
    ManyToOne('Place', (place) => place.children),
    __metadata("design:type", Object)
], Sector.prototype, "place", void 0);
Sector = __decorate([
    Entity('sectors')
], Sector);
export { Sector };
// name: "Минусинский"
// numroutes: "<b>11</b> маршрутов"
// suns: "Тень"
// web_guide_link: "/ru/guides/минусинск/кампашка/минусинский/"
