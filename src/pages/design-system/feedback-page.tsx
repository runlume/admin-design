import { useState } from 'react'
import { Ban, ShieldCheck } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { Alert } from '@/components/ui/alert'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { MultiStepLoader } from '@/components/multi-step-loader'
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from '@/components/ui/context-menu'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card'
import { Avatar } from '@/components/ui/avatar'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Skeleton } from '@/components/ui/skeleton'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { EmptyState, ErrorState, LoadingState } from '@/components/page'
import { Can, RequirePermission } from '@/components/permission'
import { Section, DesignHeader } from './section'

/** 反馈与浮层：提示条、弹窗、抽屉、确认、菜单、状态与提示消息。 */
export function DesignFeedbackPage() {
  const { t } = useTranslation()
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [step, setStep] = useState(1)
  return (
    <>
      <DesignHeader title={t('gallery.feedback')} />
      <div className="grid gap-6 xl:grid-cols-2">
        <Section
          title="浮层"
          description="弹窗、抽屉、下拉与悬停提示统一使用同一套遮罩与焦点管理。"
        >
          <div className="flex flex-wrap gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">打开弹窗</Button>
              </DialogTrigger>
              <DialogContent draggable>
                <DialogHeader>
                  <DialogTitle>弹窗标题（可拖动）</DialogTitle>
                  <DialogDescription>
                    桌面端拖动标题栏移动窗口，方向键微调（Shift
                    加速），双击标题复位；触屏与移动端保持居中。
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button variant="outline">{t('cancel')}</Button>
                  <Button>{t('confirm')}</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">大触摸屏可拖弹窗</Button>
              </DialogTrigger>
              <DialogContent draggable="always">
                <DialogHeader>
                  <DialogTitle>触摸屏也能拖动</DialogTitle>
                  <DialogDescription>
                    draggable=&quot;always&quot; 时标题栏设置 touch-action:
                    none，大触摸屏（自助机、会议室面板）也能拖动； 其余区域仍可正常滚动内容。
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button variant="outline">关闭</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline">打开抽屉</Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>抽屉标题</SheetTitle>
                  <SheetDescription>侧边抽屉用于次级表单与详情。</SheetDescription>
                </SheetHeader>
                <SheetFooter>
                  <Button variant="outline">{t('cancel')}</Button>
                  <Button>{t('confirm')}</Button>
                </SheetFooter>
              </SheetContent>
            </Sheet>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline">危险确认</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>确认删除？</AlertDialogTitle>
                  <AlertDialogDescription>该操作不可撤销。</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
                  <AlertDialogAction>删除</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">下拉菜单</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuLabel>分组标题</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>菜单项</DropdownMenuItem>
                <DropdownMenuItem disabled>禁用项</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline">悬停提示</Button>
              </TooltipTrigger>
              <TooltipContent>提示内容</TooltipContent>
            </Tooltip>
          </div>
          <p className="text-xs text-muted-foreground">
            危险动作统一走二次确认弹窗，确认按钮在异步执行期间显示加载态。
          </p>
          <Button variant="destructive" onClick={() => setConfirmOpen(true)}>
            批量删除（异步确认）
          </Button>
          <ConfirmDialog
            open={confirmOpen}
            onOpenChange={setConfirmOpen}
            tone="danger"
            title="删除所选记录？"
            description="删除后无法恢复，关联订单会保留但标记为待处理。"
            confirmLabel="删除"
            onConfirm={async () => {
              await new Promise((resolve) => window.setTimeout(resolve, 600))
              toast.success(t('sample.deleted'))
            }}
          />
        </Section>

        <Section
          title="提示消息"
          description="成功、失败与警告提示保持中性面层，仅文字与图标着色。"
        >
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={() => toast.success(t('sample.saved'))}>
              成功提示
            </Button>
            <Button variant="outline" onClick={() => toast.error(t('errorDefault'))}>
              失败提示
            </Button>
            <Button variant="outline" onClick={() => toast.warning(t('sample.warning'))}>
              警告提示
            </Button>
            <Button variant="outline" onClick={() => toast.info(t('notifications.settingsHint'))}>
              普通提示
            </Button>
          </div>
          <Alert
            variant="warning"
            title="表单未保存"
            description="离开页面前请先保存，否则本次修改会丢失。"
          />
        </Section>

        <Section
          className="xl:col-span-2"
          title="状态"
          description="加载、空、错误与骨架屏覆盖页面的三种边界。"
        >
          <div className="grid gap-4 lg:grid-cols-2">
            <MultiStepLoader
              current={step}
              steps={[
                { key: 'auth', label: '校验身份与权限', description: '读取当前账户与角色' },
                { key: 'fetch', label: '拉取业务数据', description: '分页拉取并合并' },
                { key: 'render', label: '生成视图', description: '写入缓存并渲染' },
              ]}
            />
            <div className="space-y-3">
              <Button variant="outline" onClick={() => setStep((value) => (value + 1) % 4)}>
                推进加载阶段
              </Button>
              <ContextMenu>
                <ContextMenuTrigger className="flex h-24 items-center justify-center rounded-xl border border-dashed text-sm text-muted-foreground">
                  在此区域右键打开菜单
                </ContextMenuTrigger>
                <ContextMenuContent>
                  <ContextMenuLabel>行操作</ContextMenuLabel>
                  <ContextMenuSeparator />
                  <ContextMenuItem>打开详情</ContextMenuItem>
                  <ContextMenuItem>复制编号</ContextMenuItem>
                  <ContextMenuSeparator />
                  <ContextMenuItem>删除</ContextMenuItem>
                </ContextMenuContent>
              </ContextMenu>
              <HoverCard>
                <HoverCardTrigger asChild>
                  <button
                    type="button"
                    className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm hover:border-primary/40"
                  >
                    <Avatar size="sm" name="张伟" />
                    <span>张伟</span>
                  </button>
                </HoverCardTrigger>
                <HoverCardContent>
                  <p className="text-sm font-medium">张伟 · 客户负责人</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    负责 4 家客户，最近一次跟进 2 天前。
                  </p>
                </HoverCardContent>
              </HoverCard>
            </div>
          </div>
          <div className="grid gap-4 lg:grid-cols-3">
            <div className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground">加载态</p>
              <LoadingState />
            </div>
            <div className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground">空态</p>
              <EmptyState />
            </div>
            <div className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground">骨架屏</p>
              <div className="space-y-3 rounded-xl border p-4">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
          </div>
          <ErrorState message={t('errorDefault')} traceId="trace-8f2c91" />
        </Section>

        <Section
          className="xl:col-span-2"
          title="权限"
          description="同一套权限码在菜单、路由与按钮三处生效；演示账号有 example.admin.design.view、没有 example.admin.audit.view。"
        >
          <div className="flex flex-wrap items-center gap-3">
            <Can permission="example.admin.design.view">
              <Button variant="outline">
                <ShieldCheck aria-hidden="true" />
                有权限的操作
              </Button>
            </Can>
            <Can
              permission="example.admin.audit.view"
              fallback={
                <Button variant="outline" disabled>
                  <Ban aria-hidden="true" />
                  无权限（禁用态）
                </Button>
              }
            >
              <Button variant="outline">导出审计日志</Button>
            </Can>
            <span className="text-xs text-muted-foreground">
              通配写法：`example.admin.report.*` 覆盖该资源全部权限，`*` 表示全部。
            </span>
          </div>
          <div className="rounded-xl border p-6 text-sm text-muted-foreground">
            <RequirePermission permission="example.admin.design.view">
              有权限时渲染这段内容；没有权限时同一处会渲染 403（ForbiddenPage）。
            </RequirePermission>
          </div>
        </Section>
      </div>
    </>
  )
}
