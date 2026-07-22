import { AdminRepository, adminRepository as defaultRepo } from '../repository/admin.repository';
import { CatalogService, catalogService as defaultCatalogService } from '@/modules/catalog/service/catalog.service';
import { ReviewsService, reviewsService as defaultReviewsService } from '@/modules/reviews/service/reviews.service';
import {
  AdminDashboardStatsDTO,
  BulkOperationInputDTO,
  AdminPaginationOptionsDTO,
} from '../types';
import { bulkOperationSchema, adminPaginationSchema, moderationSchema } from '../validation';
import { validateInput } from '@/shared/validation';
import { UnauthorizedError } from '@/shared/errors';
import { ContentConnectionDTO, CreateContentInputDTO, UpdateContentInputDTO, ContentDTO } from '@/modules/catalog/types';
import { ReviewConnectionDTO, ReviewDTO } from '@/modules/reviews/types';
import { Role } from '@prisma/client';

export class AdminService {
  constructor(
    private repo: AdminRepository = defaultRepo,
    private catalogService: CatalogService = defaultCatalogService,
    private reviewsService: ReviewsService = defaultReviewsService
  ) {}

  public requireAdmin(user?: { role: string } | null): void {
    if (!user || user.role !== Role.ADMIN) {
      throw new UnauthorizedError('Admin access required');
    }
  }

  public async getDashboardStats(user?: { role: string } | null): Promise<AdminDashboardStatsDTO> {
    this.requireAdmin(user);

    const stats = await this.repo.getDashboardStats();
    return {
      ...stats,
      newestContent: stats.newestContent.map((item) => this.catalogService.formatContent(item)),
    };
  }

  public async createContent(user: { role: string } | null, input: CreateContentInputDTO): Promise<ContentDTO> {
    this.requireAdmin(user);
    return this.catalogService.createContent(input);
  }

  public async updateContent(user: { role: string } | null, id: string, input: UpdateContentInputDTO): Promise<ContentDTO> {
    this.requireAdmin(user);
    return this.catalogService.updateContent(id, input);
  }

  public async softDeleteContent(user: { role: string } | null, id: string): Promise<boolean> {
    this.requireAdmin(user);
    validateInput(moderationSchema, { id });

    await this.catalogService.getContentById(id);
    await this.repo.softDeleteContent(id);
    return true;
  }

  public async restoreContent(user: { role: string } | null, id: string): Promise<ContentDTO> {
    this.requireAdmin(user);
    validateInput(moderationSchema, { id });

    const restored = await this.repo.restoreContent(id);
    return this.catalogService.formatContent(restored);
  }

  public async bulkDeleteContent(user: { role: string } | null, input: BulkOperationInputDTO): Promise<boolean> {
    this.requireAdmin(user);
    const validated = validateInput(bulkOperationSchema, input);
    return this.repo.bulkDeleteContent(validated.ids);
  }

  public async bulkRestoreContent(user: { role: string } | null, input: BulkOperationInputDTO): Promise<boolean> {
    this.requireAdmin(user);
    const validated = validateInput(bulkOperationSchema, input);
    return this.repo.bulkRestoreContent(validated.ids);
  }

  public async getDeletedContent(user: { role: string } | null, options: AdminPaginationOptionsDTO = {}): Promise<ContentConnectionDTO> {
    this.requireAdmin(user);
    const page = options.page || 1;
    const limit = options.limit || 20;
    validateInput(adminPaginationSchema, { page, limit });

    const { items, total } = await this.repo.findDeletedContent({ page, limit });
    const totalPages = Math.ceil(total / limit) || 1;

    return {
      items: items.map((item) => this.catalogService.formatContent(item)),
      total,
      page,
      limit,
      totalPages,
    };
  }

  public async getAdminContent(user: { role: string } | null, options: AdminPaginationOptionsDTO = {}): Promise<ContentConnectionDTO> {
    this.requireAdmin(user);
    const page = options.page || 1;
    const limit = options.limit || 20;
    const includeDeleted = options.includeDeleted ?? false;
    validateInput(adminPaginationSchema, { page, limit, includeDeleted });

    const { items, total } = await this.repo.findAllContentAdmin({ page, limit, includeDeleted });
    const totalPages = Math.ceil(total / limit) || 1;

    return {
      items: items.map((item) => this.catalogService.formatContent(item)),
      total,
      page,
      limit,
      totalPages,
    };
  }

  public async hideReview(user: { role: string } | null, id: string): Promise<ReviewDTO> {
    this.requireAdmin(user);
    validateInput(moderationSchema, { id });

    const hidden = await this.repo.hideReview(id);
    return this.reviewsService.formatReview(hidden);
  }

  public async restoreReview(user: { role: string } | null, id: string): Promise<ReviewDTO> {
    this.requireAdmin(user);
    validateInput(moderationSchema, { id });

    const restored = await this.repo.restoreReview(id);
    return this.reviewsService.formatReview(restored);
  }

  public async deleteReviewAdmin(user: { role: string } | null, id: string): Promise<boolean> {
    this.requireAdmin(user);
    validateInput(moderationSchema, { id });

    return this.repo.deleteReviewAdmin(id);
  }

  public async getReportedReviews(user: { role: string } | null, options: AdminPaginationOptionsDTO = {}): Promise<ReviewConnectionDTO> {
    this.requireAdmin(user);
    const page = options.page || 1;
    const limit = options.limit || 20;
    validateInput(adminPaginationSchema, { page, limit });

    const { items, total } = await this.repo.findReportedReviews({ page, limit });
    const totalPages = Math.ceil(total / limit) || 1;

    return {
      items: items.map((item) => this.reviewsService.formatReview(item)),
      total,
      page,
      limit,
      totalPages,
    };
  }
}

export const adminService = new AdminService();
